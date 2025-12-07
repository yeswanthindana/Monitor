import { useState, useEffect, useRef } from 'react';
import { SystemSnapshot, Process, HistoryPoint, CpuStats, GpuStats, MemoryStats } from '../types';
import { PROCESS_NAMES, TOTAL_RAM_GB, TOTAL_VRAM_MB, CPU_CORES } from '../constants';

// --- MOCK DATA GENERATORS (Fallback) ---
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const fluctuate = (current: number, min: number, max: number, volatility: number) => {
  const change = (Math.random() - 0.5) * volatility;
  let next = current + change;
  return Math.min(Math.max(next, min), max);
};

const generateMockProcesses = (cpuTotal: number): Process[] => {
  const count = 20;
  let remainingCpu = cpuTotal;
  return Array.from({ length: count }).map((_, i) => {
    const name = PROCESS_NAMES[Math.floor(Math.random() * PROCESS_NAMES.length)];
    const isHighLoad = Math.random() > 0.8;
    let pCpu = 0;
    if (remainingCpu > 0) {
        pCpu = isHighLoad ? random(5, Math.min(30, remainingCpu)) : random(0.1, 2);
        remainingCpu -= pCpu;
    }
    if (pCpu < 0) pCpu = 0;
    
    // Mock GPU usage: Most processes use 0, some use a chunk
    const pGpu = Math.random() > 0.85 ? random(1, 45) : 0;

    return {
      pid: 1000 + i * random(1, 10),
      name,
      cpu: pCpu,
      memory: random(100, 2048),
      gpu: pGpu,
      user: 'User',
    };
  }).sort((a, b) => b.cpu - a.cpu);
};

// --- MAIN HOOK ---

export const useSystemStats = () => {
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [isSimulation, setIsSimulation] = useState(true);
  
  // State for simulation continuity
  const mockStateRef = useRef({
    cpuUsage: 15,
    cpuTemp: 45,
    gpuUsage: 5,
    gpuTemp: 40,
    memUsed: 8,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Attempt to fetch real data
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800); // Fast timeout to avoid lag if server is down
        
        const res = await fetch('http://localhost:3001/stats', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const realData: SystemSnapshot = await res.json();
          setSnapshot(realData);
          setIsSimulation(false);
          return realData;
        } else {
          throw new Error("Server error");
        }
      } catch (e) {
        // Fallback to simulation
        const s = mockStateRef.current;
        s.cpuUsage = fluctuate(s.cpuUsage, 2, 100, 15);
        s.cpuTemp = 40 + (s.cpuUsage * 0.5) + random(-2, 2);
        s.gpuUsage = fluctuate(s.gpuUsage, 0, 100, 20);
        s.gpuTemp = 35 + (s.gpuUsage * 0.45) + random(-1, 1);
        s.memUsed = fluctuate(s.memUsed, 4, TOTAL_RAM_GB - 2, 0.5);

        // Simulated GPU Mem
        const gpuMemUsedMB = (s.gpuUsage / 100) * TOTAL_VRAM_MB * 0.8 + 500;

        const mockSnapshot: SystemSnapshot = {
            timestamp: Date.now(),
            os: "Windows 11 Pro (Simulated)",
            cpuModel: "AMD Ryzen 9 7950X (Simulated)",
            cpu: {
              usage: s.cpuUsage,
              temperature: s.cpuTemp,
              frequency: 3.5 + (s.cpuUsage / 100) * 1.5,
              cores: Array.from({ length: CPU_CORES }).map(() => Math.max(0, s.cpuUsage + random(-20, 20))),
            },
            gpu: {
              id: 'gpu-mock',
              name: 'NVIDIA GeForce RTX 4090 (Simulated)',
              usage: s.gpuUsage,
              temperature: s.gpuTemp,
              memoryUsed: gpuMemUsedMB,
              memoryTotal: TOTAL_VRAM_MB,
              fanSpeed: Math.max(30, s.gpuUsage),
            },
            memory: {
              used: s.memUsed,
              total: TOTAL_RAM_GB,
              cached: 4.5,
            },
            processes: generateMockProcesses(s.cpuUsage),
        };
        setSnapshot(mockSnapshot);
        setIsSimulation(true);
        return mockSnapshot;
      }
    };

    const interval = setInterval(async () => {
      const data = await fetchStats();
      
      // Update history
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setHistory(prev => {
        const newPoint: HistoryPoint = {
          time: timeStr,
          cpuUsage: data.cpu.usage,
          gpuUsage: data.gpu.usage,
          gpuMemoryUsage: data.gpu.memoryUsed / 1024,
          memoryUsage: (data.memory.used / data.memory.total) * 100,
          cpuTemp: data.cpu.temperature,
          gpuTemp: data.gpu.temperature,
        };
        const newHistory = [...prev, newPoint];
        if (newHistory.length > 60) return newHistory.slice(newHistory.length - 60);
        return newHistory;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { snapshot, history, isSimulation };
};