'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper, Text } from '@mantine/core';
import { formatCurrency, formatPercentage } from '@/lib/utils/format';

interface DistributionData {
  name: string;
  value: number;
  percentage: number;
}

interface DistributionChartProps {
  title: string;
  data: DistributionData[];
  height?: number;
}

export function DistributionChart({
  title,
  data,
  height = 300,
}: DistributionChartProps) {
  const colors = [
    '#7C8B7D', // sage
    '#A65D57', // terracotta
    '#6B7C8C', // slate
    '#5B664C', // olive
    '#939598', // medium gray
    '#8D4E49', // dark terracotta
  ];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper p="xs" shadow="sm">
          <Text size="sm" fw={500}>
            {data.name}
          </Text>
          <Text size="xs" c="dimmed">
            Amount: {formatCurrency(data.value)}
          </Text>
          <Text size="xs" c="dimmed">
            Percentage: {formatPercentage(data.percentage)}
          </Text>
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
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill={colors[index % colors.length]}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  style={{ fontSize: '12px' }}
                >
                  {`${data[index].name} (${formatPercentage(data[index].percentage)})`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colors[index % colors.length]}
                stroke="var(--mantine-color-body)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
} 