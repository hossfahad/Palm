'use client';

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper, Text } from '@mantine/core';
import { formatCurrency } from '@/lib/utils/format';

interface BarChartData {
  name: string;
  value: number;
  category?: string;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  categories?: string[];
  height?: number;
  vertical?: boolean;
}

export function BarChart({
  title,
  data,
  categories = ['value'],
  height = 300,
  vertical = false,
}: BarChartProps) {
  const colors = ['#7C8B7D', '#A65D57', '#6B7C8C'];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper p="xs" shadow="sm">
          <Text size="sm" fw={500}>
            {label}
          </Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} size="xs" c="dimmed">
              {entry.name}: {formatCurrency(entry.value)}
            </Text>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Text size="sm" fw={500} mb="md">
        {title}
      </Text>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={vertical ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-2)" />
          {vertical ? (
            <>
              <XAxis
                type="number"
                stroke="var(--mantine-color-gray-6)"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--mantine-color-gray-6)"
                fontSize={12}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                stroke="var(--mantine-color-gray-6)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--mantine-color-gray-6)"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Paper>
  );
} 