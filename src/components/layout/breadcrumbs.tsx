'use client';

import { Anchor, Breadcrumbs, Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  const items = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

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

  return (
    <Group mb="md">
      <Breadcrumbs>{items}</Breadcrumbs>
    </Group>
  );
} 