'use client';

import { Paper, Stack, Text, Timeline, Group } from '@mantine/core';
import {
  IconCoin,
  IconGift,
  IconBuildingBank,
} from '@tabler/icons-react';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { ActivityItem } from '@/types/dashboard';

const activityIcons = {
  donation: IconCoin,
  grant: IconGift,
  daf_creation: IconBuildingBank,
};

const activityLabels = {
  donation: 'New Donation',
  grant: 'Grant Issued',
  daf_creation: 'DAF Created',
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Text size="sm" fw={500}>
            Recent Activity
          </Text>
          <Text size="sm" c="dimmed">
            Loading activities...
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="md">
        <Text size="sm" fw={500}>
          Recent Activity
        </Text>

        <Timeline active={activities.length - 1} bulletSize={24}>
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const label = activityLabels[activity.type];

            return (
              <Timeline.Item
                key={activity.id}
                bullet={<Icon size={12} stroke={1.5} />}
                title={
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={500}>
                      {label}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {formatCurrency(activity.amount)}
                    </Text>
                  </Group>
                }
              >
                <Text size="xs" c="dimmed">
                  {formatDateTime(activity.timestamp)}
                </Text>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Stack>
    </Paper>
  );
} 