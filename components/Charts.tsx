import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HistoryPoint } from '../types';

interface HistoryChartProps {
  data: HistoryPoint[];
  dataKey: keyof HistoryPoint;
  color: string;
  title: string;
  unit?: string;
  isDark?: boolean;
}

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as HistoryPoint;
    const bgColor = isDark ? '#111' : '#fff';
    const borderColor = isDark ? '#333' : '#e5e7eb';
    const textColor = isDark ? '#fff' : '#1f2937';
    const subTextColor = isDark ? '#888' : '#6b7280';

    return (
      <div 
        className="text-xs font-mono p-3 rounded-lg border shadow-xl"
        style={{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }}
      >
        <p className="mb-2 border-b pb-1" style={{ borderColor: borderColor, color: subTextColor }}>{label}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f3ff]"></span>
                <span style={{ color: subTextColor }}>CPU Load:</span>
            </div>
            <div className="text-right font-bold">{data.cpuUsage.toFixed(1)}%</div>

            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0aff00]"></span>
                <span style={{ color: subTextColor }}>GPU Load:</span>
            </div>
            <div className="text-right font-bold">{data.gpuUsage.toFixed(1)}%</div>

            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bc13fe]"></span>
                <span style={{ color: subTextColor }}>RAM:</span>
            </div>
            <div className="text-right font-bold">{data.memoryUsage.toFixed(1)}%</div>

            <div className="flex items-center gap-2 mt-1 pt-1 border-t" style={{ borderColor: borderColor }}>
                <span className="text-[10px]" style={{ color: subTextColor }}>CPU Temp:</span>
            </div>
            <div className="text-right font-bold mt-1 pt-1 border-t" style={{ borderColor: borderColor }}>{data.cpuTemp.toFixed(0)}°C</div>
             <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: subTextColor }}>GPU Temp:</span>
            </div>
            <div className="text-right font-bold">{data.gpuTemp.toFixed(0)}°C</div>
        </div>
      </div>
    );
  }

  return null;
};

export const LiveAreaChart: React.FC<HistoryChartProps> = ({ data, dataKey, color, title, unit = '%', isDark = true }) => {
  const gridColor = isDark ? "#222" : "#e5e7eb";
  const axisColor = isDark ? "#444" : "#9ca3af";
  const tickColor = isDark ? "#666" : "#6b7280";

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2 px-2">{title}</h3>
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
                dataKey="time" 
                stroke={axisColor} 
                tick={{fill: tickColor, fontSize: 10}} 
                tickLine={false}
                interval={10}
            />
            <YAxis 
                stroke={axisColor} 
                tick={{fill: tickColor, fontSize: 10}} 
                tickLine={false} 
                domain={[0, 100]}
                width={30}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fillOpacity={1} 
                fill={`url(#gradient-${dataKey})`} 
                strokeWidth={2}
                isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CoreUsageChart: React.FC<{ cores: number[], isDark?: boolean }> = ({ cores, isDark = true }) => {
    const data = cores.map((usage, index) => ({ name: `C${index}`, usage }));
    const gridColor = isDark ? "#222" : "#e5e7eb";
    const axisColor = isDark ? "#444" : "#9ca3af";
    const tickColor = isDark ? "#666" : "#6b7280";

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2 px-2">Core Load</h3>
            <div className="flex-1 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                         <XAxis 
                            dataKey="name" 
                            stroke={axisColor} 
                            tick={{fill: tickColor, fontSize: 10}} 
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: isDark ? '#ffffff10' : '#00000005'}}
                            contentStyle={{ 
                                backgroundColor: isDark ? '#111' : '#fff', 
                                borderColor: isDark ? '#333' : '#e5e7eb', 
                                color: isDark ? '#fff' : '#1f2937' 
                            }}
                        />
                        <Bar dataKey="usage" fill="#00f3ff" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}