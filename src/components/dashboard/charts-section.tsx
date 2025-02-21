'use client';

import { Grid, Paper, Stack, Text } from '@mantine/core';
import { TrendChart } from '@/components/charts/trend-chart';
import { CauseDistribution } from '@/components/charts/cause-distribution';
import { EfficientFrontier } from '@/components/charts/efficient-frontier';

interface ChartsSectionProps {
  data: {
    trendData: {
      donations: Array<{ date: string; value: number }>;
      grants: Array<{ date: string; value: number }>;
      impact: Array<{ date: string; value: number }>;
    };
    causeDistribution: Array<{
      cause: string;
      amount: number;
      percentage: number;
    }>;
  };
}

// Sample efficient frontier data
const samplePortfolioPoints = [
  { risk: 0.12, return: 0.08, allocation: 'Conservative' },
  { risk: 0.15, return: 0.10, allocation: 'Moderate' },
  { risk: 0.18, return: 0.12, allocation: 'Growth' },
  { risk: 0.22, return: 0.14, allocation: 'Aggressive' },
];

const sampleEfficientFrontierPoints = [
  { risk: 0.10, return: 0.07 },
  { risk: 0.13, return: 0.09 },
  { risk: 0.16, return: 0.11 },
  { risk: 0.19, return: 0.13 },
  { risk: 0.23, return: 0.15 },
];

const currentPortfolio = {
  risk: 0.15,
  return: 0.10,
  allocation: 'Current Portfolio',
};

export function ChartsSection({ data }: ChartsSectionProps) {
  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TrendChart
          title="Portfolio Activity"
          data={data.trendData.donations}
          categories={['value']}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <CauseDistribution
          title="Cause Distribution"
          data={data.causeDistribution}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <EfficientFrontier
          title="Portfolio Efficient Frontier"
          portfolioPoints={samplePortfolioPoints}
          efficientFrontierPoints={sampleEfficientFrontierPoints}
          currentPortfolio={currentPortfolio}
        />
      </Grid.Col>
    </Grid>
  );
} 