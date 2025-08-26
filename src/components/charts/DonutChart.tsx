
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface DonutChartDatum {
  name: string;
  value: number; // may be percentage or raw amount
  color: string;
  rawValue?: number | string; // optional raw display value
}

interface DonutChartProps {
  data: Array<DonutChartDatum>;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  animationDuration?: number;
  height?: number;
  legendPosition?: 'bottom' | 'side';
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    const percent = typeof p?.value === 'number' ? `${p.value.toFixed(1)}%` : p?.value;
    const raw = p?.payload?.rawValueDisplay ?? p?.payload?.rawValue ?? '';
    return (
      <div className="bg-background border border-border p-2 rounded-md text-sm shadow-md">
        <p className="font-medium">{p.name}</p>
        <p className="text-muted-foreground">{percent}{raw ? ` (${raw})` : ''}</p>
      </div>
    );
  }
  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  className,
  innerRadius = 50,
  outerRadius = 70,
  animationDuration = 1000,
  height = 200,
  legendPosition = 'bottom'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Normalize data → ensure `value` is a percentage reflecting slice proportion
  const normalizedData = useMemo(() => {
    const safeData = Array.isArray(data) ? data.filter(d => Number(d?.value) >= 0) : [];
    const sum = safeData.reduce((acc, d) => acc + Number(d.value || 0), 0);

    // Heuristic: if values already sum ~100, treat as percents
    const alreadyPercent = Math.abs(sum - 100) < 0.5;

    if (alreadyPercent || sum === 0) {
      return safeData.map(d => ({
        ...d,
        value: Number(d.value) || 0,
        rawValueDisplay: d.rawValue,
      }));
    }

    // Convert raw amounts to percentages
    return safeData.map(d => {
      const pct = sum > 0 ? (Number(d.value) / sum) * 100 : 0;
      return {
        ...d,
        value: pct,
        rawValueDisplay: d.rawValue ?? Number(d.value).toLocaleString(),
      };
    });
  }, [data]);

  return (
    <div className={cn('w-full', className)} style={{ height: 'auto' }}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              animationDuration={animationDuration}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {normalizedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={activeIndex === index ? 2 : 0}
                  stroke={entry.color}
                  style={{ 
                    filter: activeIndex === index ? 'drop-shadow(0 0 3px rgba(0,0,0,0.2))' : 'none',
                    opacity: activeIndex !== null && activeIndex !== index ? 0.7 : 1,
                    transition: 'opacity 0.3s, filter 0.3s'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={cn(
        "flex flex-wrap gap-2 justify-center mt-2",
        legendPosition === 'side' ? 'flex-col items-start' : ''
      )}>
        {normalizedData.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            className="flex items-center gap-1 text-xs"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name} - {entry.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
