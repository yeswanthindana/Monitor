const express = require('express');
const cors = require('cors');
const si = require('systeminformation');

const app = express();
const PORT = 3001;

app.use(cors());

// Cache static system information to improve performance
// We fetch constant hardware details once at startup.
let staticSystemData = {
  hostname: 'Loading...',
  os: 'Loading...',
  cpuModel: 'Loading...',
  gpuName: 'Loading...',
  memTotal: 0,
  vramTotal: 0
};

// Initialize static data
const initSystemData = async () => {
  try {
    const [osInfo, cpu, mem, graphics] = await Promise.all([
      si.osInfo(),
      si.cpu(),
      si.mem(),
      si.graphics()
    ]);

    // Find discrete GPU if available
    const gpuController = graphics.controllers.find(c => c.bus !== 'Onboard') || graphics.controllers[0] || {};

    staticSystemData = {
      hostname: osInfo.hostname,
      os: `${osInfo.distro} ${osInfo.release} (${osInfo.arch})`,
      cpuModel: `${cpu.manufacturer} ${cpu.brand}`,
      gpuName: gpuController.model || 'Generic GPU',
      memTotal: mem.total,
      vramTotal: gpuController.vram || 0
    };
    console.log('Static system data loaded:', staticSystemData.hostname);
  } catch (e) {
    console.error('Error loading static system data:', e);
  }
};

initSystemData();

// Root route for status check
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: monospace; background: #111; color: #0aff00; padding: 2rem;">
        <h1>🚀 SysMon Backend is Active</h1>
        <p>Status: ONLINE</p>
        <p>Port: ${PORT}</p>
        <p>Endpoint: <a href="/stats" style="color: #00f3ff">/stats</a></p>
      </body>
    </html>
  `);
});

app.get('/stats', async (req, res) => {
  try {
    // Fetch dynamic data: Load, Temperature, Memory Activity, Graphics, Processes, CPU Frequency
    const [currentLoad, temp, mem, graphics, processes, cpuSpeed] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature(),
      si.mem(),
      si.graphics(), 
      si.processes(),
      si.cpuCurrentSpeed()
    ]);

    const gpuController = graphics.controllers.find(c => c.bus !== 'Onboard') || graphics.controllers[0] || {};
    
    // Process list mapping
    const topProcesses = processes.list
      .sort((a, b) => b.cpu - a.cpu) // Sort by CPU usage descending
      .slice(0, 20) // Take top 20
      .map(p => {
        let memoryMB = 0;
        // p.memRss is usually in bytes (Resident Set Size)
        if (p.memRss) {
             memoryMB = p.memRss / 1024 / 1024;
        } else if (p.mem) {
            // Fallback: If p.mem is percent usage
            memoryMB = (p.mem / 100) * (staticSystemData.memTotal / 1024 / 1024);
        }

        return {
          pid: p.pid,
          name: p.name,
          cpu: p.cpu,
          memory: memoryMB, 
          gpu: 0, // Note: Per-process GPU usage is difficult to obtain reliably cross-platform via node
          user: p.user || 'System'
        };
      });

    const snapshot = {
      timestamp: Date.now(),
      hostname: staticSystemData.hostname,
      os: staticSystemData.os,
      cpuModel: staticSystemData.cpuModel,
      cpu: {
        usage: currentLoad.currentLoad,
        temperature: temp.main || temp.cores[0] || 0,
        frequency: cpuSpeed.avg || cpuSpeed.main || 0, 
        cores: currentLoad.cpus.map(c => c.load)
      },
      gpu: {
        id: 'gpu-0',
        name: staticSystemData.gpuName,
        usage: gpuController.utilizationGpu || 0,
        temperature: gpuController.temperatureGpu || 0,
        memoryUsed: gpuController.memoryUsed || 0,
        memoryTotal: staticSystemData.vramTotal || 1024,
        fanSpeed: gpuController.fanSpeed || 0
      },
      memory: {
        used: mem.active / 1024 / 1024 / 1024, // GB
        total: mem.total / 1024 / 1024 / 1024, // GB
        cached: mem.buffcache / 1024 / 1024 / 1024 // GB
      },
      processes: topProcesses
    };

    res.json(snapshot);
  } catch (error) {
    console.error('Error gathering stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`
  🚀 SysMon Node Backend is running!
  ----------------------------------
  Local:   http://localhost:${PORT}/stats
  
  Note: For accurate Temperatures and Fan Speeds, run this with Admin/Sudo privileges.
  `);
});