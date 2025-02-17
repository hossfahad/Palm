'use client';

import { Anchor, Breadcrumbs, Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  // Skip the dashboard path and only show subsequent paths
  const items = paths.slice(1).map((path, index) => {
    const href = `/${paths.slice(0, index + 2).join('/')}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 2;

    return isLast ? (
      <Text key={path} size="sm" c="dimmed">
        {label}
      </Text>
    ) : (
      <Anchor key={path} component={Link} href={href} size="sm">
        {label}
      </Anchor>
    );
  });

  return items.length > 0 ? (
    <Group mb="md">
      <Breadcrumbs>{items}</Breadcrumbs>
    </Group>
  ) : null;
} 