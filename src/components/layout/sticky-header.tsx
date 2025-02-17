import { Box, Group } from '@mantine/core';
import { Logo } from '@/components/brand/logo';
import Link from 'next/link';

export function StickyHeader() {
  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
      }}
    >
      <Group py="md" px="md">
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
      </Group>
    </Box>
  );
} 