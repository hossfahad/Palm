import { SpotlightAction } from '@mantine/spotlight';
import {
  IconDashboard,
  IconHeartHandshake,
  IconBuildingBank,
  IconFileAnalytics,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

export const spotlightActions: SpotlightAction[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Go to main dashboard',
    onClick: () => window.location.href = '/dashboard',
    leftSection: <IconDashboard size={20} stroke={1.5} />,
  },
  {
    id: 'charities',
    label: 'Charity Discovery',
    description: 'Search and discover charities',
    onClick: () => window.location.href = '/dashboard/charities',
    leftSection: <IconHeartHandshake size={20} stroke={1.5} />,
  },
  {
    id: 'dafs',
    label: 'DAF Management',
    description: 'Manage donor-advised funds',
    onClick: () => window.location.href = '/dashboard/dafs',
    leftSection: <IconBuildingBank size={20} stroke={1.5} />,
  },
  {
    id: 'documents',
    label: 'Tax Documents',
    description: 'View and manage tax documents',
    onClick: () => window.location.href = '/dashboard/documents',
    leftSection: <IconFileAnalytics size={20} stroke={1.5} />,
  },
  {
    id: 'network',
    label: 'Network',
    description: 'View network activity',
    onClick: () => window.location.href = '/dashboard/network',
    leftSection: <IconUsers size={20} stroke={1.5} />,
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage account settings',
    onClick: () => window.location.href = '/dashboard/settings',
    leftSection: <IconSettings size={20} stroke={1.5} />,
  },
]; 