'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper, Text } from '@mantine/core';
import { formatCurrency } from '@/lib/utils/format';
import { ChartData } from '@/types/dashboard';

interface TrendChartProps {
  title: string;
  data: ChartData[];
  categories?: string[];
  height?: number;
}

export function TrendChart({
  title,
  data,
  categories = ['value'],
  height = 300,
}: TrendChartProps) {
  const colors = ['#7C8B7D', '#A65D57', '#6B7C8C'];

  return (
    <Paper p="md" radius="md" withBorder>
      <Text size="sm" fw={500} mb="md">
        {title}
      </Text>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
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
            contentStyle={{
              backgroundColor: 'var(--mantine-color-body)',
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-sm)',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
} 