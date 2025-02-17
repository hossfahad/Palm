'use client';

import { useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { BaseWidget } from './base-widget';
import { WidgetGridProps, Widget } from '@/types/widgets';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GRID_COLS = 12;
const ROW_HEIGHT = 100;
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

export function WidgetGrid({
  config,
  onLayoutChange,
  onWidgetChange,
  isEditing = false,
}: WidgetGridProps) {
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedWidgets = config.widgets.map((widget: Widget) => {
        const layoutItem = newLayout.find((item) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            layout: layoutItem,
          };
        }
        return widget;
      });

      onLayoutChange(newLayout);
      onWidgetChange(updatedWidgets);
    },
    [config.widgets, onLayoutChange, onWidgetChange]
  );

  const handleWidgetRefresh = useCallback(
    (widgetId: string) => {
      const updatedWidgets = config.widgets.map((widget: Widget) =>
        widget.id === widgetId
          ? { ...widget, isLoading: true }
          : widget
      );
      onWidgetChange(updatedWidgets);
    },
    [config.widgets, onWidgetChange]
  );

  const handleWidgetRemove = useCallback(
    (widgetId: string) => {
      const updatedWidgets = config.widgets.filter(
        (widget: Widget) => widget.id !== widgetId
      );
      const updatedLayout = config.layouts.filter(
        (item) => item.i !== widgetId
      );
      onLayoutChange(updatedLayout);
      onWidgetChange(updatedWidgets);
    },
    [config.widgets, config.layouts, onLayoutChange, onWidgetChange]
  );

  const handleWidgetConfig = useCallback(
    (widgetId: string, widgetConfig: Record<string, any>) => {
      const updatedWidgets = config.widgets.map((widget: Widget) =>
        widget.id === widgetId
          ? { ...widget, config: widgetConfig }
          : widget
      );
      onWidgetChange(updatedWidgets);
    },
    [config.widgets, onWidgetChange]
  );

  return (
    <div className="w-full min-h-screen p-4">
      <GridLayout
        className="layout"
        layout={config.layouts}
        cols={GRID_COLS}
        rowHeight={ROW_HEIGHT}
        width={1200}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms
      >
        {config.widgets.map((widget: Widget) => (
          <div key={widget.id}>
            <BaseWidget
              widget={widget}
              onRefresh={handleWidgetRefresh}
              onRemove={isEditing ? handleWidgetRemove : undefined}
              onConfigChange={isEditing ? handleWidgetConfig : undefined}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
} 