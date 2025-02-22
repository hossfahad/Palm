import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Title, SimpleGrid, Paper, Text } from '@mantine/core';

export default async function ClientDashboard() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Title order={1}>My Dashboard</Title>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper shadow="xs" p="xl" radius="md">
          <Title order={3} mb="xs">My Causes</Title>
          <Text size="sm" c="dimmed">
            View and manage your philanthropic causes
          </Text>
        </Paper>

        <Paper shadow="xs" p="xl" radius="md">
          <Title order={3} mb="xs">Recent Activity</Title>
          <Text size="sm" c="dimmed">
            Track your recent activities and updates
          </Text>
        </Paper>
      </SimpleGrid>
    </div>
  );
} 