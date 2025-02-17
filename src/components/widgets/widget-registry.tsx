'use client';

import { StatsWidget } from './stats-widget';
import { ChartWidget } from './chart-widget';
import { WidgetType } from '@/types/widgets';

export const widgetComponents: Record<WidgetType, React.ComponentType<any>> = {
  stats: StatsWidget,
  chart: ChartWidget,
  table: () => <div>Table Widget (Coming Soon)</div>,
}; 