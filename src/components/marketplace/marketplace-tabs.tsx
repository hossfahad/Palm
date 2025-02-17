'use client';

import { Tabs } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';

interface MarketplaceTabsProps {
  children: React.ReactNode;
}

export function MarketplaceTabs({ children }: MarketplaceTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/offerings')) return 'offerings';
    return 'offerings'; // Default tab
  };

  return (
    <Tabs
      value={getActiveTab()}
      onChange={(value) => {
        router.push(`/dashboard/marketplace/${value}`);
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="offerings">Offerings</Tabs.Tab>
      </Tabs.List>

      {children}
    </Tabs>
  );
} 