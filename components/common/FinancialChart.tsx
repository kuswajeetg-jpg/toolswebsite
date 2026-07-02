"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type ChartData = {
  name: string | number;
  invested: number;
  returns: number;
  balance?: number;
};

interface FinancialChartProps {
  data: ChartData[];
  xAxisKey?: string;
}

const formatCurrency = (value: number) => {
    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
};

export default function FinancialChart({ data, xAxisKey = "name" }: FinancialChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
         Wealth Growth Projection
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
             dataKey={xAxisKey} 
             tick={{ fontSize: 12, fill: '#6b7280' }} 
             tickLine={false} 
             axisLine={false}
             tickFormatter={(val) => `Yr ${val}`}
          />
          <YAxis 
             tick={{ fontSize: 12, fill: '#6b7280' }} 
             tickLine={false} 
             axisLine={false} 
             tickFormatter={formatCurrency}
             width={80}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <Tooltip 
             formatter={(value: any, name: any) => [
                 `₹${Number(value).toLocaleString('en-IN')}`, 
                 name === 'invested' ? 'Total Invested' : 'Est. Returns'
             ]}
             labelFormatter={(label) => `Year ${label}`}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="invested"
            name="invested"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorInvested)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="returns"
            name="returns"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorReturns)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
