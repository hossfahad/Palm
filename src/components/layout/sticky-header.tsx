import { Box, Group, Avatar } from '@mantine/core';
import { Logo } from '@/components/brand/logo';
import Link from 'next/link';

export function StickyHeader() {
  return (
    <Box
      h={60}
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group h="100%" px="md" justify="space-between">
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
        <Avatar 
          radius="xl" 
          size="md"
          style={{ cursor: 'pointer' }}
        />
      </Group>
    </Box>
  );
} 