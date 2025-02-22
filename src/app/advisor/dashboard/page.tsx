'use client';

import { Container, Stack, Title, Grid, Group } from '@mantine/core';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ClientsHero } from '@/components/clients/clients-hero';
import { ClientSelector } from '@/components/client/client-selector';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import { useClients } from '@/hooks/use-clients';
import { ActivityItem } from '@/types/dashboard';

const inter = Inter({ subsets: ['latin'] });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

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

// Mock data for activity feed
const activityData: ActivityItem[] = [
  {
    id: '1',
    type: 'donation',
    amount: 50000,
    timestamp: '2024-02-18T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'grant',
    amount: 25000,
    timestamp: '2024-02-17T15:45:00Z',
    status: 'approved'
  },
  {
    id: '3',
    type: 'daf_creation',
    amount: 100000,
    timestamp: '2024-02-16T09:15:00Z',
    status: 'active'
  }
];

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

export default function DashboardPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { clients } = useClients();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: "Hi there! Ask me about any charity or non-profit."
  }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
      };
      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'This is a simulated response. AI integration coming soon!',
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hi there! Ask me about any charity or non-profit."
    }]);
  };

  const handleAddClient = async (name: string, email: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    console.log('Adding client:', { firstName, lastName, email });
  };

  const formattedClients = clients.map(client => ({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`,
    email: client.email,
    dafs: client.dafs || 0,
    totalValue: client.totalValue || 0,
    lastActivity: client.lastActivity || new Date().toISOString(),
    status: client.status
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