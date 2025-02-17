'use client';

import { Tabs } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';

interface ManageTabsProps {
  children: React.ReactNode;
}

export function ManageTabs({ children }: ManageTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/clients')) return 'clients';
    if (pathname.includes('/permissions')) return 'permissions';
    return 'profile'; // Default tab
  };

  return (
    <Tabs
      value={getActiveTab()}
      onChange={(value) => {
        router.push(`/dashboard/manage/${value}`);
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="clients">Clients</Tabs.Tab>
        <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
      </Tabs.List>

      {children}
    </Tabs>
  );
} 