'use client';

import { AppShell, Text, UnstyledButton, Group } from '@mantine/core';
import { IconUsers, IconUserPlus, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { label: 'Family Members', icon: IconUsers, href: '/dashboard/access' },
  { label: 'Invitations', icon: IconUserPlus, href: '/dashboard/access/invitations' },
  { label: 'Settings', icon: IconSettings, href: '/dashboard/access/settings' },
];

interface NavbarLinkProps {
  icon: typeof IconUsers;
  label: string;
  href: string;
  active?: boolean;
}

function NavbarLink({ icon: Icon, label, href, active }: NavbarLinkProps) {
  return (
    <UnstyledButton
      component={Link}
      href={href}
      style={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colors.gray[7],
        backgroundColor: active ? theme.colors.gray[0] : 'transparent',
        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <Icon size={16} />
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Text fw={500} size="sm" c="dimmed" mb="xs">
          Access Management
        </Text>
        
        {navigation.map((item) => (
          <NavbarLink
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 