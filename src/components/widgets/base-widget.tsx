'use client';

import { Card, Group, ActionIcon, Menu, Loader } from '@mantine/core';
import { IconDots, IconRefresh, IconTrash, IconSettings } from '@tabler/icons-react';
import { WidgetProps } from '@/types/widgets';
import { widgetComponents } from './widget-registry';

export function BaseWidget({ widget, onConfigChange, onRefresh, onRemove }: WidgetProps) {
  const WidgetComponent = widgetComponents[widget.type];

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <span className="font-medium text-sm">{widget.title}</span>
          <Group gap="xs">
            {widget.isLoading && <Loader size="xs" />}
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label="Widget options"
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {onRefresh && (
                  <Menu.Item
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => onRefresh(widget.id)}
                  >
                    Refresh
                  </Menu.Item>
                )}
                {onConfigChange && (
                  <Menu.Item
                    leftSection={<IconSettings size={16} />}
                    onClick={() =>
                      onConfigChange(widget.id, widget.config || {})
                    }
                  >
                    Configure
                  </Menu.Item>
                )}
                {onRemove && (
                  <Menu.Item
                    leftSection={<IconTrash size={16} />}
                    color="red"
                    onClick={() => onRemove(widget.id)}
                  >
                    Remove
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Card.Section>

      <Card.Section inheritPadding py="md">
        {widget.error ? (
          <div className="text-red-500 text-sm">{widget.error}</div>
        ) : (
          <div className="w-full h-full min-h-[200px]">
            <WidgetComponent data={widget.data} config={widget.config} />
          </div>
        )}
      </Card.Section>
    </Card>
  );
} 