import { Box, Group, Title, Stack } from '@mantine/core';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Box px="md">
      <Stack gap="xl" py="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>{title}</Title>
          {action}
        </Group>
      </Stack>
    </Box>
  );
} 