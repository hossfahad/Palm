'use client';

import { Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  Sector,
} from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/utils/format';
import { useState } from 'react';

interface CauseDistributionData {
  cause: string;
  amount: number;
  percentage: number;
}

interface CauseDistributionProps {
  title?: string;
  data: CauseDistributionData[];
  height?: number;
}

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="currentColor"
        style={{ fontSize: '14px' }}
      >
        {payload.cause}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: '12px' }}
      >
        {`${formatCurrency(value)} (${formatPercentage(payload.percentage)})`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper p="xs" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            {data.cause}
          </Text>
          <Text size="xs" c="dimmed">
            Amount: {formatCurrency(data.amount)}
          </Text>
          <Text size="xs" c="dimmed">
            Percentage: {formatPercentage(data.percentage)}
          </Text>
        </Stack>
      </Paper>
    );
  }
  return null;
};

export function CauseDistribution({
  title = 'Cause Distribution',
  data,
  height = 400,
}: CauseDistributionProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const theme = useMantineTheme();

  const colors = [
    theme.colors.blue[6],
    theme.colors.teal[6],
    theme.colors.green[6],
    theme.colors.orange[6],
    theme.colors.indigo[6],
    theme.colors.pink[6],
  ];

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={500} size="sm">
          {title}
        </Text>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="amount"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="figure"
                aria-label={title}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.cause}
                    fill={colors[index % colors.length]}
                    stroke="var(--mantine-color-body)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: 'none' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <Text size="sm" span>
                    {value}
                  </Text>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
} 