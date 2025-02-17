'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface ChartWidgetProps {
  data?: Array<{
    date: string;
    value: number;
  }>;
}

export function ChartWidget({ data }: ChartWidgetProps) {
  const mockData = [
    { date: '2024-01', value: 850000 },
    { date: '2024-02', value: 920000 },
    { date: '2024-03', value: 1100000 },
    { date: '2024-04', value: 980000 },
    { date: '2024-05', value: 1250000 },
  ];

  const chartData = data || mockData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-2)" />
        <XAxis
          dataKey="date"
          stroke="var(--mantine-color-gray-6)"
          fontSize={12}
        />
        <YAxis
          stroke="var(--mantine-color-gray-6)"
          fontSize={12}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'var(--mantine-color-body)',
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--mantine-color-sage-5)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 