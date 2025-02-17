'use client';

import { Button, Group, Menu, ActionIcon } from '@mantine/core';
import {
  IconPlus,
  IconChartBar,
  IconTable,
  IconChartPie,
  IconLayoutGrid,
  IconRefresh,
  IconEdit,
} from '@tabler/icons-react';
import { Widget, WidgetType } from '@/types/widgets';
import { generateId } from '@/lib/utils';

interface WidgetToolbarProps {
  onAddWidget: (widget: Widget) => void;
  onResetLayout: () => void;
  onToggleEdit: () => void;
  isEditing: boolean;
}

const DEFAULT_WIDGET_CONFIG = {
  chart: {
    w: 6,
    h: 4,
    minW: 3,
    minH: 3,
  },
  stats: {
    w: 3,
    h: 2,
    minW: 2,
    minH: 2,
  },
  table: {
    w: 6,
    h: 4,
    minW: 4,
    minH: 3,
  },
};

export function WidgetToolbar({
  onAddWidget,
  onResetLayout,
  onToggleEdit,
  isEditing,
}: WidgetToolbarProps) {
  const handleAddWidget = (type: WidgetType, title: string) => {
    const id = generateId();
    const config = DEFAULT_WIDGET_CONFIG[type] || DEFAULT_WIDGET_CONFIG.chart;

    const widget: Widget = {
      id,
      type,
      title,
      layout: {
        i: id,
        x: 0,
        y: Infinity, // Add to bottom
        ...config,
      },
    };

    onAddWidget(widget);
  };

  return (
    <Group gap="xs" mb="md">
      <Menu position="bottom-start">
        <Menu.Target>
          <Button leftSection={<IconPlus size={16} />}>Add Widget</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconChartBar size={16} />}
            onClick={() => handleAddWidget('chart', 'Chart Widget')}
          >
            Chart Widget
          </Menu.Item>
          <Menu.Item
            leftSection={<IconChartPie size={16} />}
            onClick={() => handleAddWidget('stats', 'Stats Widget')}
          >
            Stats Widget
          </Menu.Item>
          <Menu.Item
            leftSection={<IconTable size={16} />}
            onClick={() => handleAddWidget('table', 'Table Widget')}
          >
            Table Widget
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ActionIcon
        variant={isEditing ? 'filled' : 'light'}
        color={isEditing ? 'blue' : 'gray'}
        onClick={onToggleEdit}
        title={isEditing ? 'Save Layout' : 'Edit Layout'}
      >
        <IconEdit size={16} />
      </ActionIcon>

      <ActionIcon
        variant="light"
        color="gray"
        onClick={onResetLayout}
        title="Reset Layout"
      >
        <IconRefresh size={16} />
      </ActionIcon>
    </Group>
  );
} 