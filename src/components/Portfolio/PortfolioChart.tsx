import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  date: string;
  investment: number;
  exitValue: number;
  profit: number;
  status: string;
}

interface PortfolioChartProps {
  data: ChartData[];
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Performance du Portfolio</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString('fr-FR')}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Area
              type="monotone"
              dataKey="investment"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorInvestment)"
              name="Investissement"
            />
            <Area
              type="monotone"
              dataKey="exitValue"
              stroke={(data: any) => data.status === 'won' ? '#22c55e' : '#ef4444'}
              fillOpacity={1}
              fill={(data: any) => `url(#color${data.status === 'won' ? 'Profit' : 'Loss'})`}
              name="Valeur de Sortie"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}