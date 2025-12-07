import React, { useState, useEffect } from 'react';
import { useSystemStats } from './hooks/useSystemStats';
import { StatCard } from './components/StatCard';
import { LiveAreaChart, CoreUsageChart } from './components/Charts';
import { ProcessTable } from './components/ProcessTable';
import { TabView, SystemSnapshot } from './types';
import { 
  Cpu, 
  Database, 
  Activity, 
  Zap, 
  Thermometer, 
  LayoutDashboard, 
  List, 
  Wifi,
  WifiOff
} from 'lucide-react';

const MetricsTable: React.FC<{ snapshot: SystemSnapshot }> = ({ snapshot }) => {
  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-border bg-white/5">
            <h3 className="text-gray-300 font-semibold text-sm font-mono uppercase">Real-time Telemetry Log</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
                <thead className="bg-black/20 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">CPU %</th>
                        <th className="px-6 py-3 font-medium">GPU %</th>
                        <th className="px-6 py-3 font-medium">GPU Memory (Gi)</th>
                        <th className="px-6 py-3 font-medium">RAM (Gi)</th>
                        <th className="px-6 py-3 font-medium">CPU Temp</th>
                        <th className="px-6 py-3 font-medium">GPU Temp</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                        <td className="px-6 py-4 text-neon-blue">{snapshot.cpu.usage.toFixed(1)}%</td>
                        <td className="px-6 py-4 text-neon-green">{snapshot.gpu.usage.toFixed(1)}%</td>
                        <td className="px-6 py-4">{(snapshot.gpu.memoryUsed / 1024).toFixed(2)} Gi</td>
                        <td className="px-6 py-4 text-neon-purple">{snapshot.memory.used.toFixed(2)} Gi</td>
                        <td className={`px-6 py-4 ${snapshot.cpu.temperature > 80 ? 'text-neon-red' : ''}`}>{snapshot.cpu.temperature.toFixed(1)}°C</td>
                        <td className={`px-6 py-4 ${snapshot.gpu.temperature > 85 ? 'text-neon-red' : ''}`}>{snapshot.gpu.temperature.toFixed(1)}°C</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}

const App: React.FC = () => {
  const { snapshot, history, isSimulation } = useSystemStats();
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: HH:MM:SS.mmm
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
      const ms = now.getMilliseconds().toString().padStart(3, '0');
      setCurrentTime(`${timeStr}.${ms}`);
    };

    const interval = setInterval(updateTime, 50);
    updateTime(); // Initial call

    return () => clearInterval(interval);
  }, []);

  // If loading
  if (!snapshot) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-bg text-neon-blue font-mono">
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-spin" size={48} />
          <span className="animate-pulse">INITIALIZING TELEMETRY UPLINK...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex font-sans overflow-hidden">
      
      {/* Sidebar / Navigation */}
      <nav className="w-16 md:w-20 border-r border-dark-border flex flex-col items-center py-6 gap-8 bg-dark-card z-20">
        <div className="p-2 bg-neon-blue/10 rounded-lg">
          <Activity className="text-neon-blue" size={28} />
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center">
            <button 
                onClick={() => setActiveTab(TabView.DASHBOARD)}
                className={`p-3 rounded-xl transition-all ${activeTab === TabView.DASHBOARD ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 hover:text-white'}`}
                title="Dashboard"
            >
                <LayoutDashboard size={24} />
            </button>
            <button 
                 onClick={() => setActiveTab(TabView.PROCESSES)}
                 className={`p-3 rounded-xl transition-all ${activeTab === TabView.PROCESSES ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 hover:text-white'}`}
                 title="Processes"
            >
                <List size={24} />
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-dark-border flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                    SysMon <span className="text-neon-blue font-mono text-sm px-2 py-0.5 rounded border border-neon-blue/30 bg-neon-blue/10">v2.5-RC</span>
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                    {isSimulation ? 'Simulated Hardware Telemetry' : 'Live Hardware Telemetry'}
                </p>
            </div>
            <div className="flex items-center gap-6">
                <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-white/5 transition-colors ${
                    isSimulation 
                    ? 'text-yellow-500 bg-yellow-500/10' 
                    : 'text-green-500 bg-green-500/10'
                }`}>
                    {isSimulation ? <WifiOff size={14} /> : <Wifi size={14} />}
                    {isSimulation ? 'Simulation Mode' : 'Real-Time Data'}
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-xs text-gray-400">Local Time</div>
                    <div className="text-sm font-mono text-white min-w-[100px]">{currentTime}</div>
                </div>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
            
            {activeTab === TabView.DASHBOARD && (
                <div className="space-y-6 max-w-7xl mx-auto pb-10">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard 
                            label="CPU Usage"
                            value={`${snapshot.cpu.usage.toFixed(1)}%`}
                            subValue={`${snapshot.cpu.frequency.toFixed(2)} GHz`}
                            icon={Cpu}
                            color="text-neon-blue"
                            borderColor="#00f3ff"
                            details={
                                <div className="h-12 w-full mt-2">
                                     <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-neon-blue transition-all duration-300 ease-out"
                                            style={{ width: `${snapshot.cpu.usage}%` }}
                                        />
                                     </div>
                                     <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                                        <span>Load</span>
                                        <span>{snapshot.cpu.cores.length} Cores</span>
                                     </div>
                                </div>
                            }
                        />
                        <StatCard 
                            label="GPU Load"
                            value={`${snapshot.gpu.usage.toFixed(1)}%`}
                            subValue={`${(snapshot.gpu.memoryUsed / 1024).toFixed(1)} GB VRAM`}
                            icon={Zap}
                            color="text-neon-green"
                            borderColor="#0aff00"
                            details={
                                <div className="flex flex-col text-xs text-gray-400 mt-2 font-mono">
                                    <div className="flex justify-between w-full">
                                      <span className="truncate pr-2" title={snapshot.gpu.name}>{snapshot.gpu.name.split(' ').slice(0,2).join(' ')}</span>
                                      <span className="whitespace-nowrap">Fan: {snapshot.gpu.fanSpeed.toFixed(0)}%</span>
                                    </div>
                                </div>
                            }
                        />
                        <StatCard 
                            label="Memory"
                            value={`${snapshot.memory.used.toFixed(1)} GB`}
                            subValue={`of ${snapshot.memory.total.toFixed(0)} GB`}
                            icon={Database}
                            color="text-neon-purple"
                            borderColor="#bc13fe"
                            details={
                                 <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-4">
                                    <div 
                                        className="h-full bg-neon-purple transition-all duration-300 ease-out"
                                        style={{ width: `${(snapshot.memory.used / snapshot.memory.total) * 100}%` }}
                                    />
                                 </div>
                            }
                        />
                        <StatCard 
                            label="Temperature"
                            value={`${snapshot.cpu.temperature.toFixed(0)}°C`}
                            subValue={`CPU`}
                            icon={Thermometer}
                            color={snapshot.cpu.temperature > 80 ? "text-neon-red" : "text-neon-yellow"}
                            borderColor={snapshot.cpu.temperature > 80 ? "#ff003c" : "#fcee0a"}
                            details={
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-white/5 rounded p-1.5 text-center">
                                        <div className="text-[10px] text-gray-500 uppercase">GPU</div>
                                        <div className={`text-sm font-mono ${snapshot.gpu.temperature > 85 ? 'text-neon-red' : 'text-white'}`}>
                                            {snapshot.gpu.temperature.toFixed(0)}°C
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded p-1.5 text-center">
                                        <div className="text-[10px] text-gray-500 uppercase">Sys</div>
                                        <div className="text-sm font-mono text-white">--</div>
                                    </div>
                                </div>
                            }
                        />
                    </div>

                    {/* Charts Row 1: CPU */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
                        <div className="lg:col-span-2 bg-dark-card rounded-xl border border-dark-border p-4">
                             <LiveAreaChart 
                                data={history} 
                                dataKey="cpuUsage" 
                                color="#00f3ff" 
                                title="CPU Usage History" 
                            />
                        </div>
                        <div className="bg-dark-card rounded-xl border border-dark-border p-4">
                            <CoreUsageChart cores={snapshot.cpu.cores} />
                        </div>
                    </div>

                     {/* Charts Row 2: GPU */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
                        <div className="lg:col-span-2 bg-dark-card rounded-xl border border-dark-border p-4">
                             <LiveAreaChart 
                                data={history} 
                                dataKey="gpuUsage" 
                                color="#0aff00" 
                                title="GPU Load History" 
                            />
                        </div>
                         {/* New GPU Memory Chart */}
                        <div className="bg-dark-card rounded-xl border border-dark-border p-4">
                            <LiveAreaChart 
                                data={history} 
                                dataKey="gpuMemoryUsage" 
                                color="#0aff00" 
                                title="GPU Memory (GB)"
                                unit=" GB" 
                            />
                        </div>
                    </div>

                    {/* New Metrics Table */}
                    <div className="grid grid-cols-1 gap-6">
                        <MetricsTable snapshot={snapshot} />
                    </div>

                    {/* Quick Specs (Moved to bottom small section) */}
                     <div className="bg-dark-card rounded-xl border border-dark-border p-4 relative overflow-hidden">
                             <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-4">Host Specifications</h3>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-300 font-mono">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Processor</span>
                                    <span>{snapshot.cpuModel}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Graphics</span>
                                    <span>{snapshot.gpu.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Memory</span>
                                    <span>{snapshot.memory.total.toFixed(0)} GB Total</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">OS</span>
                                    <span>{snapshot.os}</span>
                                </div>
                             </div>
                        </div>

                </div>
            )}

            {activeTab === TabView.PROCESSES && (
                <div className="h-full">
                    <ProcessTable processes={snapshot.processes} />
                </div>
            )}
            
        </div>
      </main>
    </div>
  );
};

export default App;