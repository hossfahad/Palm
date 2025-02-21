'use client';

import { useState } from 'react';
import {
  Card,
  Text,
  Table,
  Button,
  Menu,
  Avatar,
  Badge,
  Group,
  Stack,
} from '@mantine/core';
import { IconDotsVertical, IconUserPlus } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/format';
import type { FamilyMember } from '@/hooks/use-family-members';

interface FamilyMemberListProps {
  members: FamilyMember[];
  onInviteMember: () => void;
  onUpdateRole: (memberId: string, role: 'FAMILY_MEMBER' | 'CLIENT') => void;
  onRemoveMember: (memberId: string) => void;
}

const roleColors: Record<string, string> = {
  FAMILY_MEMBER: 'blue',
  CLIENT: 'green',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  INACTIVE: 'gray',
};

export function FamilyMemberList({
  members,
  onInviteMember,
  onUpdateRole,
  onRemoveMember,
}: FamilyMemberListProps) {
  return (
    <Card withBorder shadow="sm" radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={500} size="lg">Family Members</Text>
            <Text c="dimmed" size="sm">
              Manage your family members and their roles
            </Text>
          </div>
          <Button
            onClick={onInviteMember}
            variant="light"
            leftSection={<IconUserPlus size={16} />}
          >
            Invite Member
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Member</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last Active</Table.Th>
              <Table.Th style={{ width: 50 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((member) => (
              <Table.Tr key={member.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar
                      src={member.profileImage}
                      radius="xl"
                    >
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        {member.firstName} {member.lastName}
                        {member.isHeadOfFamily && (
                          <Badge ml="xs" variant="light">
                            Head of Family
                          </Badge>
                        )}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {member.email}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={roleColors[member.role]} variant="light">
                    {member.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColors[member.status]} variant="light">
                    {member.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {member.lastActivity
                    ? formatDate(member.lastActivity)
                    : 'Never'}
                </Table.Td>
                <Table.Td>
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        size="sm"
                        p={0}
                        w={30}
                        h={30}
                      >
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() =>
                          onUpdateRole(member.id, 'FAMILY_MEMBER')
                        }
                      >
                        Set as Family Member
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => onUpdateRole(member.id, 'CLIENT')}
                      >
                        Set as Client
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        Remove Member
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
} 