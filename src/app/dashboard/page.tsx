'use client';

import { Container, Stack, Title, Grid, Group } from '@mantine/core';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ClientsHero } from '@/components/clients/clients-hero';
import { ClientSelector } from '@/components/client/client-selector';
import { useState } from 'react';
import { Message } from '@/lib/services/chat-service';
import { Inter } from 'next/font/google';
import { useClients } from '@/hooks/use-clients';

const inter = Inter({ subsets: ['latin'] });

// Mock data for metrics
const metricsData = {
  totalDonations: 1250000,
  activeDAFs: 45,
  pendingGrants: 12,
  metrics: {
    donationGrowth: 12.5,
    averageGrant: 25000,
    totalImpact: 2500000,
  },
};

// Mock data for charts
const chartsData = {
  trendData: {
    donations: [
      { date: '2024-01', value: 100000 },
      { date: '2024-02', value: 150000 },
      { date: '2024-03', value: 125000 },
    ],
    grants: [
      { date: '2024-01', value: 75000 },
      { date: '2024-02', value: 85000 },
      { date: '2024-03', value: 95000 },
    ],
    impact: [
      { date: '2024-01', value: 180000 },
      { date: '2024-02', value: 200000 },
      { date: '2024-03', value: 220000 },
    ],
  },
  causeDistribution: [
    { cause: 'Education', amount: 500000, percentage: 40 },
    { cause: 'Healthcare', amount: 375000, percentage: 30 },
    { cause: 'Environment', amount: 250000, percentage: 20 },
    { cause: 'Arts', amount: 125000, percentage: 10 },
  ],
};

// Mock data for activity feed
const activityData = [
  {
    id: '1',
    type: 'donation' as const,
    amount: 50000,
    timestamp: '2024-02-18T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'grant' as const,
    amount: 25000,
    timestamp: '2024-02-17T15:45:00Z',
    status: 'approved',
  },
  {
    id: '3',
    type: 'daf_creation' as const,
    amount: 100000,
    timestamp: '2024-02-16T09:15:00Z',
    status: 'active',
  },
];

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { clients, addClient, isCreating } = useClients();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  const handleAddClient = async (name: string, email: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    await addClient({
      firstName,
      lastName,
      email,
      status: 'PENDING',
      advisorId: 'current-advisor-id', // This should come from your auth context
      preferredContactMethod: 'email',
      relationshipStartDate: new Date().toISOString(),
      secondaryAdvisors: [],
      causeAreas: [],
    });
  };

  const formattedClients = clients.map(client => ({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`,
    email: client.email,
    dafs: client.dafs || 0,
    totalValue: client.totalValue || 0,
    lastActivity: client.lastActivity || new Date().toISOString(),
  }));

  return (
    <Container size="xl" pb={0}>
      <Stack gap="xl" className={inter.className}>
        <ClientsHero />
        
        <Group justify="space-between" align="center">
          <Title fw={400}>Dashboard</Title>
          <ClientSelector
            clients={formattedClients}
            selectedClientId={selectedClientId}
            onClientChange={setSelectedClientId}
            onAddClient={handleAddClient}
          />
        </Group>
        
        <MetricsGrid data={metricsData} loading={false} />
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <ChartsSection data={chartsData} />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xl" pb="xl">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
              />
              <ActivityFeed activities={activityData} loading={false} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
} 