'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Group, Stack, Box, ActionIcon, Badge } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconArrowUpRight } from '@tabler/icons-react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

interface Fund {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  minContribution: number;
  features: string[];
}

const funds: Fund[] = [
  {
    id: 'community-foundation',
    name: 'Community Foundation DAF',
    type: 'Community Foundation',
    location: 'San Francisco, CA',
    description: 'A donor-advised fund program focused on local impact with personalized guidance and community-specific insights.',
    minContribution: 25000,
    features: ['Local Impact Focus', 'Personalized Guidance', 'Community Events'],
  },
  {
    id: 'national-program',
    name: 'National DAF Program',
    type: 'National Institution',
    location: 'New York, NY',
    description: 'A comprehensive national donor-advised fund program offering diverse investment options and broad philanthropic reach.',
    minContribution: 50000,
    features: ['National Network', 'Investment Flexibility', 'Grant Specialists'],
  },
  {
    id: 'impact-first',
    name: 'Impact First DAF',
    type: 'Impact Foundation',
    location: 'Boston, MA',
    description: 'An innovative DAF program specializing in impact investments and sustainable philanthropy solutions.',
    minContribution: 100000,
    features: ['Impact Investing', 'ESG Integration', 'Impact Measurement'],
  },
];

export function ClientsHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextFund = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((current) => (current + 1) % funds.length);
      setIsTransitioning(false);
    }, 300);
  };

  const previousFund = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((current) => (current - 1 + funds.length) % funds.length);
      setIsTransitioning(false);
    }, 300);
  };

  const interval = useInterval(nextFund, 5000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  const activeFund = funds[activeIndex];

  return (
    <Link 
      href={`/dashboard/marketplace/offerings/${activeFund.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Box
        py="xl"
        className={inter.className}
        style={{
          background: 'linear-gradient(135deg, #5BBFBA 0%, rgba(91, 191, 186, 0.8) 50%, rgba(91, 191, 186, 0) 100%)',
          borderRadius: 'var(--mantine-radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          ':hover': {
            transform: 'translateY(-2px)',
          }
        }}
      >
        <Container size="xl">
          <Stack gap="xl" style={{ position: 'relative' }}>
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Group gap="xs" align="center">
                  <Text size="sm" c="white" tt="uppercase" opacity={0.8}>
                    Featured Fund
                  </Text>
                  <IconArrowUpRight size={16} color="white" opacity={0.8} />
                </Group>
                <Title
                  order={1}
                  size="h1"
                  fw={400}
                  style={{
                    color: 'white',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {activeFund.name}
                </Title>
              </Stack>

              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="white"
                  onClick={(e) => {
                    e.preventDefault();
                    previousFund();
                  }}
                  size="lg"
                  radius="xl"
                >
                  <IconChevronLeft style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="white"
                  onClick={(e) => {
                    e.preventDefault();
                    nextFund();
                  }}
                  size="lg"
                  radius="xl"
                >
                  <IconChevronRight style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
              </Group>
            </Group>

            <Group 
              align="flex-start" 
              style={{ 
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              <Stack gap="md" style={{ flex: 1 }}>
                <Group gap="xs">
                  <Text size="xl" fw={400} c="white">
                    {activeFund.type}
                  </Text>
                  <Text size="xl" c="white" opacity={0.5}>•</Text>
                  <Text size="xl" fw={400} c="white">
                    Min. ${(activeFund.minContribution).toLocaleString()}
                  </Text>
                </Group>
                <Text size="lg" c="white" opacity={0.9}>
                  {activeFund.description}
                </Text>
                <Group gap="xs" mt="xs">
                  {activeFund.features.map((feature) => (
                    <Badge 
                      key={feature}
                      variant="white"
                      size="lg"
                      radius="sm"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                      }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Link>
  );
} 