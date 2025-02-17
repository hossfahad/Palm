'use client';

import { Group, ActionIcon, Text, Avatar, Menu } from '@mantine/core';
import { useUser, UserButton } from '@clerk/nextjs';
import { IconBell, IconSearch } from '@tabler/icons-react';
import { openSpotlight } from '@mantine/spotlight';

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <Group justify="space-between" style={{ flex: 1 }}>
      <Text size="lg" fw={500}>
        Palm Philanthropy
      </Text>

      <Group gap="sm">
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => openSpotlight()}
          title="Search (⌘K)"
        >
          <IconSearch size={20} stroke={1.5} />
        </ActionIcon>
        
        <ActionIcon
          variant="subtle"
          color="gray"
          title="Notifications"
        >
          <IconBell size={20} stroke={1.5} />
        </ActionIcon>

        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
              userButtonPopup: 'min-w-[240px]',
            },
          }}
        />
      </Group>
    </Group>
  );
} 