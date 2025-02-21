'use client';

import { Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatPercentage } from '@/lib/utils/format';

interface PortfolioPoint {
  risk: number;
  return: number;
  allocation?: string;
}

interface EfficientFrontierProps {
  title?: string;
  portfolioPoints: PortfolioPoint[];
  efficientFrontierPoints: PortfolioPoint[];
  height?: number;
  currentPortfolio?: PortfolioPoint;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper p="xs" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
        <Stack gap={4}>
          {data.allocation && (
            <Text size="sm" fw={500}>
              {data.allocation}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            Expected Return: {formatPercentage(data.return)}
          </Text>
          <Text size="xs" c="dimmed">
            Risk: {formatPercentage(data.risk)}
          </Text>
        </Stack>
      </Paper>
    );
  }
  return null;
};

export function EfficientFrontier({
  title = 'Efficient Frontier',
  portfolioPoints,
  efficientFrontierPoints,
  height = 400,
  currentPortfolio,
}: EfficientFrontierProps) {
  const theme = useMantineTheme();

  // Determine chart boundaries
  const allPoints = [...portfolioPoints, ...efficientFrontierPoints];
  const minRisk = Math.min(...allPoints.map(p => p.risk));
  const maxRisk = Math.max(...allPoints.map(p => p.risk));
  const minReturn = Math.min(...allPoints.map(p => p.return));
  const maxReturn = Math.max(...allPoints.map(p => p.return));

  // Add some padding to the boundaries
  const padding = 0.02; // 2%
  const domain = {
    x: [minRisk - padding, maxRisk + padding],
    y: [minReturn - padding, maxReturn + padding],
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={500} size="sm">
          {title}
        </Text>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[2]} />
              <XAxis
                type="number"
                dataKey="risk"
                name="Risk"
                domain={domain.x}
                tickFormatter={value => formatPercentage(value)}
                label={{ value: 'Risk (Standard Deviation)', position: 'bottom' }}
              />
              <YAxis
                type="number"
                dataKey="return"
                name="Return"
                domain={domain.y}
                tickFormatter={value => formatPercentage(value)}
                label={{ value: 'Expected Return', angle: -90, position: 'left' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Portfolio points */}
              <Scatter
                name="Portfolio Options"
                data={portfolioPoints}
                fill={theme.colors.blue[6]}
                opacity={0.6}
              />

              {/* Efficient Frontier line */}
              <Scatter
                name="Efficient Frontier"
                data={efficientFrontierPoints}
                fill={theme.colors.green[6]}
                line
                lineType="joint"
                shape="circle"
              />

              {/* Current Portfolio point if provided */}
              {currentPortfolio && (
                <Scatter
                  name="Current Portfolio"
                  data={[currentPortfolio]}
                  fill={theme.colors.orange[6]}
                  shape="star"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
} 