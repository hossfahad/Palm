'use client';

import { Grid, Paper, Stack, Text } from '@mantine/core';
import { AreaChart, PieChart } from '@mantine/charts';

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

export function ChartsSection({ data }: ChartsSectionProps) {
  return (
    <Grid gutter="lg">
      <Grid.Col span={12}>
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Text fw={500}>Portfolio Activity</Text>
            <AreaChart
              h={300}
              data={data.trendData.donations}
              dataKey="date"
              series={[
                { name: 'value', color: 'sage.6' },
              ]}
              curveType="natural"
              gridAxis="xy"
              withLegend
              withTooltip
              tooltipAnimationDuration={200}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Text fw={500}>Cause Distribution</Text>
            <PieChart
              h={300}
              data={data.causeDistribution.map(item => ({
                name: item.cause,
                value: item.amount,
                color: `var(--mantine-color-sage-${Math.floor(Math.random() * 3) + 4})`,
              }))}
              withTooltip
              tooltipDataSource="segment"
              valueFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
} 