import React from 'react';
import { Process } from '../types';
import { Activity, Box } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ processes }) => {
  // We use a visual scale cap for memory bars. 
  // While system max is 32GB, a single process rarely exceeds 4GB. 
  // Scaling to 4GB makes the bars more meaningful for comparison.
  const VISUAL_MEM_MAX_MB = 4096; 

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-dark-border flex justify-between items-center bg-white/5">
            <h3 className="text-gray-300 font-semibold text-sm flex items-center gap-2">
                <Activity size={16} className="text-neon-blue"/>
                Active Processes ({processes.length})
            </h3>
            <span className="text-xs text-gray-500 font-mono px-2 py-1 bg-black/20 rounded">
                PID Sorted
            </span>
        </div>
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-black/20 text-gray-500 font-mono text-xs uppercase sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                        <th className="px-4 py-3 font-medium">Process Name</th>
                        <th className="px-4 py-3 font-medium text-right">PID</th>
                        <th className="px-4 py-3 font-medium text-right">CPU %</th>
                        <th className="px-4 py-3 font-medium text-right">GPU %</th>
                        <th className="px-4 py-3 font-medium text-right">Memory (MB)</th>
                        <th className="px-4 py-3 font-medium">User</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {processes.map((proc) => (
                        <tr key={proc.pid} className="hover:bg-white/5 transition-colors group">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Box size={14} className="text-gray-600 group-hover:text-neon-blue transition-colors" />
                                    <span className="text-gray-300 font-medium">{proc.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500 font-mono align-top pt-3.5">{proc.pid}</td>
                            <td className="px-4 py-2 text-right">
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`font-mono ${proc.cpu > 10 ? 'text-neon-red' : proc.cpu > 5 ? 'text-neon-yellow' : 'text-gray-400'}`}>
                                        {proc.cpu.toFixed(1)}%
                                    </span>
                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.5)]" 
                                            style={{ width: `${Math.min(proc.cpu, 100)}%` }} 
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`font-mono ${proc.gpu && proc.gpu > 10 ? 'text-neon-green' : 'text-gray-500'}`}>
                                        {proc.gpu ? proc.gpu.toFixed(1) : '0.0'}%
                                    </span>
                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-neon-green shadow-[0_0_8px_rgba(10,255,0,0.5)]" 
                                            style={{ width: `${Math.min(proc.gpu || 0, 100)}%` }} 
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2 text-right text-gray-400 font-mono">
                                <div className="flex flex-col items-end gap-1">
                                    <span>{proc.memory.toFixed(0)}</span>
                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-neon-purple shadow-[0_0_8px_rgba(188,19,254,0.5)]" 
                                            style={{ width: `${Math.min((proc.memory / VISUAL_MEM_MAX_MB) * 100, 100)}%` }} 
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 font-mono text-xs align-top pt-3.5">{proc.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};