'use client';

import { useState } from 'react';
import {
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  TextInput,
  MultiSelect,
  NumberInput,
  Button,
} from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import Link from 'next/link';

interface DAFProgram {
  id: string;
  name: string;
  organization: string;
  minimumContribution: number;
  programType: string;
  geographicFocus: string[];
  fees: string;
}

const mockPrograms: DAFProgram[] = [
  {
    id: '1',
    name: 'Community Foundation DAF',
    organization: 'Local Community Foundation',
    minimumContribution: 5000,
    programType: 'Community',
    geographicFocus: ['Local', 'Regional'],
    fees: '1% annually',
  },
  {
    id: '2',
    name: 'National DAF Program',
    organization: 'National Charitable Trust',
    minimumContribution: 25000,
    programType: 'National',
    geographicFocus: ['National'],
    fees: '0.85% annually',
  },
];

export function OfferingsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minContribution, setMinContribution] = useState<number | ''>(0);

  const programTypes = ['Community', 'National', 'International'];
  const regions = ['Local', 'Regional', 'National', 'International'];

  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(program.programType);
    const matchesRegion = selectedRegions.length === 0 || 
      program.geographicFocus.some(focus => selectedRegions.includes(focus));
    const matchesContribution = !minContribution || program.minimumContribution >= minContribution;

    return matchesSearch && matchesType && matchesRegion && matchesContribution;
  });

  return (
    <Stack gap="xl">
      <Card withBorder>
        <Group gap="md">
          <TextInput
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <MultiSelect
            data={programTypes}
            placeholder="Program Type"
            value={selectedTypes}
            onChange={setSelectedTypes}
            leftSection={<IconFilter size={16} />}
          />
          <MultiSelect
            data={regions}
            placeholder="Geographic Focus"
            value={selectedRegions}
            onChange={setSelectedRegions}
            leftSection={<IconFilter size={16} />}
          />
          <NumberInput
            placeholder="Min. Contribution"
            value={minContribution}
            onChange={(value) => setMinContribution(value === '' ? '' : Number(value))}
            min={0}
            step={1000}
            prefix="$"
          />
        </Group>
      </Card>

      <Grid>
        {filteredPrograms.map((program) => (
          <Grid.Col key={program.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs">
                    <Text fw={500} size="lg">{program.name}</Text>
                    <Text c="dimmed" size="sm">{program.organization}</Text>
                  </Stack>
                  <Badge>{program.programType}</Badge>
                </Group>

                <Stack gap="xs">
                  <Text size="sm">
                    <Text span fw={500}>Minimum Contribution:</Text> ${program.minimumContribution.toLocaleString()}
                  </Text>
                  <Text size="sm">
                    <Text span fw={500}>Fees:</Text> {program.fees}
                  </Text>
                  <Text size="sm">
                    <Text span fw={500}>Geographic Focus:</Text>
                  </Text>
                  <Group gap="xs">
                    {program.geographicFocus.map((focus) => (
                      <Badge key={focus} variant="light" color="sage">
                        {focus}
                      </Badge>
                    ))}
                  </Group>
                </Stack>

                <Button
                  component={Link}
                  href={`/dashboard/marketplace/offerings/${program.id}`}
                  variant="light"
                  fullWidth
                >
                  View Details
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
} 