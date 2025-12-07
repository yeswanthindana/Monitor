const express = require('express');
const cors = require('cors');
const si = require('systeminformation');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/stats', async (req, res) => {
  try {
    // Fetch all required data in parallel
    const [cpu, mem, currentLoad, temp, graphics, processes, osInfo] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.currentLoad(),
      si.cpuTemperature(),
      si.graphics(),
      si.processes(),
      si.osInfo()
    ]);

    // System Information libraries return varying formats based on OS/Drivers
    // We attempt to find the discrete GPU, otherwise fallback to first available
    const gpuController = graphics.controllers.find(c => c.bus !== 'Onboard') || graphics.controllers[0] || {};
    
    // Construct SystemSnapshot
    const snapshot = {
      timestamp: Date.now(),
      os: `${osInfo.distro} ${osInfo.release} (${osInfo.arch})`,
      cpuModel: `${cpu.manufacturer} ${cpu.brand}`,
      cpu: {
        usage: currentLoad.currentLoad,
        temperature: temp.main || 0, // Requires admin rights on some OS
        frequency: cpu.speed,
        cores: currentLoad.cpus.map(c => c.load)
      },
      gpu: {
        id: 'gpu-0',
        name: gpuController.model || 'Generic GPU',
        usage: gpuController.utilizationGpu || 0,
        temperature: gpuController.temperatureGpu || 0,
        memoryUsed: gpuController.memoryUsed || 0,
        memoryTotal: gpuController.vram || 0,
        // Attempt to read fan speed, fallback to 0 if sensor is unreadable
        fanSpeed: gpuController.fanSpeed || 0 
      },
      memory: {
        used: mem.active / 1024 / 1024 / 1024, // Convert bytes to GB
        total: mem.total / 1024 / 1024 / 1024,
        cached: mem.buffcache / 1024 / 1024 / 1024
      },
      processes: processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 20)
        .map(p => ({
          pid: p.pid,
          name: p.name,
          cpu: p.cpu,
          memory: p.mem / 1024 / 1024, // Convert bytes to MB
          // Note: Standard system APIs do not easily provide per-process GPU usage. 
          // We set this to 0 to satisfy the frontend interface.
          gpu: 0, 
          user: p.user
        }))
    };

    res.json(snapshot);
  } catch (error) {
    console.error('Error gathering stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`
  🚀 SysMon Backend is running!
  -----------------------------
  Local:   http://localhost:${PORT}/stats
  
  Keep this terminal open to feed data to the dashboard.
  Note: For accurate Temperatures and Fan Speeds, run this with Admin/Sudo privileges.
  `);
});