'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Grid,
  List,
  ThemeIcon,
  Box,
  Container,
  Tabs,
  Loader,
} from '@mantine/core';
import { IconCheck, IconArrowLeft, IconDownload, IconChartBar, IconQuestionMark } from '@tabler/icons-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface DAFProgram {
  id: string;
  name: string;
  organization: string;
  minimumContribution: number;
  programType: string;
  geographicFocus: string[];
  fees: string;
  description: string;
  fundObjective: string;
  features: string[];
  investmentOptions: string[];
  grantingDetails: {
    minimumGrant: number;
    grantingFrequency: string;
    internationalGranting: boolean;
    anonymousGranting: boolean;
  };
  ticker: string;
  expenses: string;
  assets: string;
}

export default function DAFDetailsPage() {
  const { id } = useParams();
  const [program, setProgram] = useState<DAFProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgram() {
      try {
        const response = await fetch(`/api/marketplace/offerings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch program');
        }
        const data = await response.json();
        setProgram(data);
      } catch (error) {
        console.error('Failed to fetch program:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <Box py="xl">
        <Container size="xl">
          <Stack align="center" gap="xl">
            <Loader size="lg" />
            <Text>Loading program details...</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!program) {
    return (
      <Box py="xl">
        <Container size="xl">
          <Stack align="center" gap="xl">
            <Text>Program not found.</Text>
            <Button
              component={Link}
              href="/dashboard/marketplace/offerings"
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
            >
              Back to Programs
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Stack gap={0}>
      <Box pos="relative" style={{ overflow: 'hidden' }}>
        <Container size="xl" py="xl">
          <Stack gap="xl">
            <Group justify="space-between">
              <Stack gap="md">
                <Text size="xl" fw={500} style={{ color: 'var(--mantine-color-sage-7)' }}>
                  {program.name}
                </Text>
                <Group gap="xl">
                  <Button
                    component={Link}
                    href="/dashboard/marketplace/offerings"
                    variant="light"
                    leftSection={<IconArrowLeft size={16} />}
                  >
                    Back to Programs
                  </Button>
                  <Button
                    variant="light"
                    leftSection={<IconDownload size={16} />}
                  >
                    Fact Sheet
                  </Button>
                </Group>
              </Stack>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Stack gap="lg">
                  <Stack gap={4}>
                    <Text fw={500}>Fund Description</Text>
                    <Text size="sm" c="dimmed">{program.description}</Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text fw={500}>Fund Objective</Text>
                    <Text size="sm" c="dimmed">{program.fundObjective}</Text>
                  </Stack>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Stack gap="xs">
                    <Text fw={500} size="sm">Fund Information</Text>
                    <Group justify="space-between">
                      <Text size="sm">Ticker</Text>
                      <Text fw={500}>{program.ticker}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Expenses</Text>
                      <Text fw={500}>{program.expenses}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Assets</Text>
                      <Text fw={500}>{program.assets}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Minimum Contribution</Text>
                      <Text fw={500}>${program.minimumContribution.toLocaleString()}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box bg="var(--mantine-color-gray-0)" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Container size="xl">
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="performance" leftSection={<IconChartBar size={16} />}>Performance</Tabs.Tab>
              <Tabs.Tab value="faq" leftSection={<IconQuestionMark size={16} />}>Fund FAQ</Tabs.Tab>
            </Tabs.List>

            <Box py="xl">
              <Tabs.Panel value="overview">
                <Grid>
                  <Grid.Col span={8}>
                    <Stack gap="xl">
                      <Stack gap="xs">
                        <Text fw={500}>Key Features</Text>
                        <List
                          spacing="xs"
                          icon={
                            <ThemeIcon color="sage" size={20} radius="xl">
                              <IconCheck size={12} />
                            </ThemeIcon>
                          }
                        >
                          {program.features.map((feature) => (
                            <List.Item key={feature}>{feature}</List.Item>
                          ))}
                        </List>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={500}>Investment Options</Text>
                        <List
                          spacing="xs"
                          icon={
                            <ThemeIcon color="sage" size={20} radius="xl">
                              <IconCheck size={12} />
                            </ThemeIcon>
                          }
                        >
                          {program.investmentOptions.map((option) => (
                            <List.Item key={option}>{option}</List.Item>
                          ))}
                        </List>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={500}>Geographic Focus</Text>
                        <Group gap="xs">
                          {program.geographicFocus.map((focus) => (
                            <Badge key={focus} variant="light" color="sage">
                              {focus}
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <Card withBorder>
                      <Stack gap="md">
                        <Text fw={500}>Granting Details</Text>
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Text size="sm">Minimum Grant Size</Text>
                            <Text fw={500}>${program.grantingDetails.minimumGrant}</Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm">Granting Frequency</Text>
                            <Text fw={500}>{program.grantingDetails.grantingFrequency}</Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm">International Granting</Text>
                            <Text fw={500}>{program.grantingDetails.internationalGranting ? 'Yes' : 'No'}</Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm">Anonymous Granting</Text>
                            <Text fw={500}>{program.grantingDetails.anonymousGranting ? 'Yes' : 'No'}</Text>
                          </Group>
                        </Stack>

                        <Button fullWidth size="lg" color="sage">
                          Open Account
                        </Button>
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="performance">
                Performance data coming soon...
              </Tabs.Panel>

              <Tabs.Panel value="faq">
                FAQ content coming soon...
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Container>
      </Box>
    </Stack>
  );
} 