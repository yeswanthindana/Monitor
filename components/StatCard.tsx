import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class, e.g., 'text-neon-blue'
  borderColor: string; // Hex for inline style border
  trend?: 'up' | 'down' | 'stable';
  details?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  color, 
  borderColor,
  details
}) => {
  return (
    <div 
        className="relative bg-dark-card rounded-xl p-5 border border-dark-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10"
        style={{ borderTop: `2px solid ${borderColor}` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider">{label}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
            {subValue && <span className="text-gray-500 text-sm font-mono">{subValue}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      
      {details && (
        <div className="mt-4 pt-4 border-t border-white/5">
            {details}
        </div>
      )}
    </div>
  );
};
