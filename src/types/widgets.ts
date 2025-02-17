import { Layout } from 'react-grid-layout';
import { ReactNode } from 'react';

export type WidgetType = 'chart' | 'stats' | 'table';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  layout: Layout;
  data?: any;
  isLoading?: boolean;
  error?: string;
  config?: Record<string, any>;
  children?: ReactNode;
}

export interface WidgetLayout extends Layout {
  i: string;
}

export interface WidgetGridConfig {
  layouts: WidgetLayout[];
  widgets: Widget[];
}

export interface WidgetProps {
  widget: Widget;
  onConfigChange?: (widgetId: string, config: Record<string, any>) => void;
  onRefresh?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
}

export interface WidgetGridProps {
  config: WidgetGridConfig;
  onLayoutChange: (layout: Layout[]) => void;
  onWidgetChange: (widgets: Widget[]) => void;
  isEditing?: boolean;
} 