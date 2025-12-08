import React, { useState, useMemo } from 'react';
import { Process } from '../types';
import { Activity, Box, Search, X } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ processes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // We use a visual scale cap for memory bars. 
  // While system max is 32GB, a single process rarely exceeds 4GB. 
  // Scaling to 4GB makes the bars more meaningful for comparison.
  const VISUAL_MEM_MAX_MB = 4096; 

  const filteredProcesses = useMemo(() => {
    if (!searchQuery) return processes;
    const lowerQuery = searchQuery.toLowerCase();
    return processes.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.pid.toString().includes(lowerQuery)
    );
  }, [processes, searchQuery]);

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border flex flex-col h-full overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-dark-border flex flex-col sm:flex-row justify-between items-center bg-dark-surface gap-3">
            <h3 className="text-text-main font-semibold text-sm flex items-center gap-2">
                <Activity size={16} className="text-neon-blue"/>
                Active Processes ({filteredProcesses.length})
            </h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative group w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-text-muted" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by Name or PID..."
                        className="w-full bg-dark-bg border border-dark-border text-text-main text-xs rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all placeholder-text-muted"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
                <span className="text-xs text-text-muted font-mono px-2 py-1 bg-dark-bg border border-dark-border rounded hidden md:block">
                    PID Sorted
                </span>
            </div>
        </div>
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-dark-bg/90 text-text-muted font-mono text-xs uppercase sticky top-0 backdrop-blur-sm z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 font-medium">Process Name</th>
                        <th className="px-4 py-3 font-medium text-right">PID</th>
                        <th className="px-4 py-3 font-medium text-right">CPU %</th>
                        <th className="px-4 py-3 font-medium text-right">GPU %</th>
                        <th className="px-4 py-3 font-medium text-right">Memory (MB)</th>
                        <th className="px-4 py-3 font-medium">User</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                    {filteredProcesses.length > 0 ? (
                        filteredProcesses.map((proc) => (
                            <tr key={proc.pid} className="hover:bg-dark-surface transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Box size={14} className="text-text-muted group-hover:text-neon-blue transition-colors" />
                                        <span className="text-text-main font-medium">{proc.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right text-text-muted font-mono align-top pt-3.5">{proc.pid}</td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`font-mono ${proc.cpu > 10 ? 'text-neon-red' : proc.cpu > 5 ? 'text-neon-yellow' : 'text-text-muted'}`}>
                                            {proc.cpu.toFixed(1)}%
                                        </span>
                                        <div className="w-24 h-1 bg-dark-bg rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.5)]" 
                                                style={{ width: `${Math.min(proc.cpu, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`font-mono ${proc.gpu && proc.gpu > 10 ? 'text-neon-green' : 'text-text-muted'}`}>
                                            {proc.gpu ? proc.gpu.toFixed(1) : '0.0'}%
                                        </span>
                                        <div className="w-24 h-1 bg-dark-bg rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-neon-green shadow-[0_0_8px_rgba(10,255,0,0.5)]" 
                                                style={{ width: `${Math.min(proc.gpu || 0, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-right text-text-muted font-mono">
                                    <div className="flex flex-col items-end gap-1">
                                        <span>{proc.memory.toFixed(0)}</span>
                                        <div className="w-24 h-1 bg-dark-bg rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-neon-purple shadow-[0_0_8px_rgba(188,19,254,0.5)]" 
                                                style={{ width: `${Math.min((proc.memory / VISUAL_MEM_MAX_MB) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-text-muted font-mono text-xs align-top pt-3.5">{proc.user}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                                No processes found matching "{searchQuery}"
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};