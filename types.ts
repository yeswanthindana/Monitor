export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number; // in MB
  gpu?: number;
  user: string;
}

export interface GpuStats {
  id: string;
  name: string;
  usage: number; // percentage
  temperature: number; // celsius
  memoryUsed: number; // MB
  memoryTotal: number; // MB
  fanSpeed: number; // percentage
}

export interface CpuStats {
  usage: number; // percentage
  temperature: number; // celsius
  frequency: number; // GHz
  cores: number[]; // usage per core
}

export interface MemoryStats {
  used: number; // GB
  total: number; // GB
  cached: number; // GB
}

export interface SystemSnapshot {
  timestamp: number;
  cpu: CpuStats;
  gpu: GpuStats;
  memory: MemoryStats;
  processes: Process[];
  os: string;
  cpuModel: string;
}

export interface HistoryPoint {
  time: string;
  cpuUsage: number;
  gpuUsage: number;
  gpuMemoryUsage: number; // GB
  memoryUsage: number;
  cpuTemp: number;
  gpuTemp: number;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  PROCESSES = 'PROCESSES',
  ADVISOR = 'ADVISOR',
}