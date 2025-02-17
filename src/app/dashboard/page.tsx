'use client';

import { useState } from 'react';
import { Container, Grid, Paper, Tabs, Text, Title, Group, Stack, Card, Box } from '@mantine/core';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Message } from '@/lib/services/chat-service';
import { Client, ClientSummary } from '@/types/client';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

// Temporary mock data
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    dafs: [
      {
        id: 'daf1',
        name: 'Doe Family Foundation',
        balance: 2800000,
        sponsor: 'Fidelity Charitable',
        accountNumber: 'FID-123456',
      }
    ],
    totalPortfolioValue: 2800000,
    activeGrants: 12,
    lastActivity: {
      type: 'Grant Approved',
      description: 'Environmental Conservation Fund',
      timestamp: new Date(),
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    dafs: [
      {
        id: 'daf2',
        name: 'Smith Family Foundation',
        balance: 1500000,
        sponsor: 'Schwab Charitable',
        accountNumber: 'SCH-789012',
      }
    ],
    totalPortfolioValue: 1500000,
    activeGrants: 8,
    lastActivity: {
      type: 'Grant Submitted',
      description: 'Education Initiative',
      timestamp: new Date(),
    },
  },
];

// Mock dashboard data
const mockDashboardData = {
  totalDonations: 4300000,
  activeDAFs: 20,
  pendingGrants: 15,
  metrics: {
    donationGrowth: 12.5,
    averageGrant: 25000,
    totalImpact: 150,
  },
  recentActivity: [
    {
      id: '1',
      type: 'donation' as const,
      amount: 50000,
      description: 'New donation to Environmental Fund',
      timestamp: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      type: 'grant' as const,
      amount: 25000,
      description: 'Grant approved for Education Initiative',
      timestamp: new Date().toISOString(),
      status: 'completed',
    },
  ],
  trendData: {
    donations: [
      { date: '2024-01-01', value: 250000 },
      { date: '2024-02-01', value: 300000 },
      { date: '2024-03-01', value: 280000 },
      { date: '2024-04-01', value: 320000 },
      { date: '2024-05-01', value: 350000 },
      { date: '2024-06-01', value: 380000 },
    ],
    grants: [
      { date: '2024-01-01', value: 150000 },
      { date: '2024-02-01', value: 180000 },
      { date: '2024-03-01', value: 200000 },
      { date: '2024-04-01', value: 220000 },
      { date: '2024-05-01', value: 240000 },
      { date: '2024-06-01', value: 260000 },
    ],
    impact: [
      { date: '2024-01-01', value: 100 },
      { date: '2024-02-01', value: 120 },
      { date: '2024-03-01', value: 140 },
      { date: '2024-04-01', value: 160 },
      { date: '2024-05-01', value: 180 },
      { date: '2024-06-01', value: 200 },
    ],
  },
  causeDistribution: [
    { cause: 'Education', amount: 1200000, percentage: 30 },
    { cause: 'Environment', amount: 800000, percentage: 20 },
    { cause: 'Healthcare', amount: 1000000, percentage: 25 },
    { cause: 'Arts', amount: 600000, percentage: 15 },
    { cause: 'Social Justice', amount: 400000, percentage: 10 },
  ],
};

export default function DashboardPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(MOCK_CLIENTS[0].id);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setMessages([]);
  };

  const handleAddClient = async (name: string, email: string) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name,
      email,
      dafs: [],
      totalPortfolioValue: 0,
      activeGrants: 0,
    };
    setClients(prev => [...prev, newClient]);
    setSelectedClientId(newClient.id);
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const userMessage: Message = {
        role: 'user',
        content: message,
      };
      setMessages(prev => [...prev, userMessage]);

      const newMessages = [...messages, userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  // Convert Client to ClientSummary for the selector
  const clientSummaries: ClientSummary[] = clients.map(client => ({
    id: client.id,
    name: client.name,
    totalPortfolioValue: client.totalPortfolioValue,
  }));

  return (
    <Stack gap="xl">
      <DashboardHeader
        clients={clientSummaries}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
        onAddClient={handleAddClient}
      />

      <Container size="100%" px="xl">
        {/* Main Content */}
        <Grid gutter="xl">
          {/* Left Column - Main Content */}
          <Grid.Col span={{ base: 12, lg: 9 }}>
            <Stack gap="xl">
              {/* Hero Section */}
              <Paper
                radius="lg"
                h={300}
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-sage-4) 0%, var(--mantine-color-sage-6) 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Stack justify="flex-end" h="100%" p="xl" style={{ position: 'relative', zIndex: 2 }}>
                  <Title c="white" order={2} size="h2">{selectedClient.name}'s Portfolio</Title>
                  <Text c="white" size="lg" opacity={0.9}>
                    Manage philanthropic investments and impact
                  </Text>
                  <Tabs
                    variant="pills"
                    radius="md"
                    mt="md"
                    styles={{
                      tab: {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '&[data-active]': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        padding: '8px 16px',
                      },
                      list: {
                        gap: '8px',
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        padding: '4px',
                      },
                    }}
                    defaultValue="overview"
                  >
                    <Tabs.List>
                      <Tabs.Tab value="overview">Overview</Tabs.Tab>
                      <Tabs.Tab value="dafs">DAFs ({selectedClient.dafs.length})</Tabs.Tab>
                      <Tabs.Tab value="grants">Grants ({selectedClient.activeGrants})</Tabs.Tab>
                      <Tabs.Tab value="impact">Impact</Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                </Stack>
              </Paper>

              {/* Metrics Grid */}
              <MetricsGrid data={mockDashboardData} loading={false} />

              {/* Charts Section */}
              <ChartsSection data={mockDashboardData} />

              {/* Activity Feed */}
              <Card radius="lg" withBorder>
                <Stack gap="md">
                  <Text fw={500} size="lg">Recent Activity</Text>
                  <ActivityFeed activities={mockDashboardData.recentActivity} />
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Right Column - AI Assistant */}
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Box 
              pos="sticky"
              top="80px"
              style={{ height: 'calc(100vh - 100px)' }}
            >
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onReset={handleResetChat}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Stack>
  );
} 