'use client';

import { Container, Stack, Title, SimpleGrid, Paper, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import AvailableToGive from '@/components/dashboard/metrics/AvailableToGive';
import AssetAllocation from '@/components/dashboard/metrics/AssetAllocation';

export default function ClientDashboardPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={1}>My Dashboard</Title>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <AvailableToGive />
          <AssetAllocation />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Paper shadow="xs" p="xl" radius="md">
            <Title order={3} mb="xs">My Causes</Title>
            <Text size="sm" c="dimmed">
              View and manage your philanthropic causes
            </Text>
          </Paper>

          <Paper shadow="xs" p="xl" radius="md">
            <Title order={3} mb="xs">Recent Activity</Title>
            <Text size="sm" c="dimmed">
              Track your recent activities and updates
            </Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
} 