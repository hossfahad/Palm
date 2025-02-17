'use client';

import { Container } from '@mantine/core';
import { ManageTabs } from '@/components/manage/manage-tabs';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="xl" py="xl">
      <ManageTabs>{children}</ManageTabs>
    </Container>
  );
} 