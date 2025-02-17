'use client';

import { Container } from '@mantine/core';
import { MarketplaceTabs } from '@/components/marketplace/marketplace-tabs';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="xl" py="xl">
      <MarketplaceTabs>{children}</MarketplaceTabs>
    </Container>
  );
} 