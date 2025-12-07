import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HistoryPoint, CpuStats } from '../types';

interface HistoryChartProps {
  data: HistoryPoint[];
  dataKey: keyof HistoryPoint;
  color: string;
  title: string;
  unit?: string;
}

export const LiveAreaChart: React.FC<HistoryChartProps> = ({ data, dataKey, color, title, unit = '%' }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 px-2">{title}</h3>
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
                dataKey="time" 
                stroke="#444" 
                tick={{fill: '#666', fontSize: 10}} 
                tickLine={false}
                interval={10}
            />
            <YAxis 
                stroke="#444" 
                tick={{fill: '#666', fontSize: 10}} 
                tickLine={false} 
                domain={[0, 100]}
                width={30}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: color }}
                formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
                labelStyle={{ color: '#888' }}
            />
            <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fillOpacity={1} 
                fill={`url(#gradient-${dataKey})`} 
                strokeWidth={2}
                isAnimationActive={false} // Disable animation for smooth real-time updates
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CoreUsageChart: React.FC<{ cores: number[] }> = ({ cores }) => {
    const data = cores.map((usage, index) => ({ name: `C${index}`, usage }));

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 px-2">Core Load</h3>
            <div className="flex-1 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                         <XAxis 
                            dataKey="name" 
                            stroke="#444" 
                            tick={{fill: '#666', fontSize: 10}} 
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: '#ffffff10'}}
                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                        />
                        <Bar dataKey="usage" fill="#00f3ff" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
