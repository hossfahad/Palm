import { useState, useCallback, useEffect } from 'react';
import { Layout } from 'react-grid-layout';
import { Widget, WidgetGridConfig } from '@/types/widgets';

const STORAGE_KEY = 'widget-grid-config';

export function useWidgetGrid(initialConfig: WidgetGridConfig) {
  const [config, setConfig] = useState<WidgetGridConfig>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to load widget configuration:', error);
      }
    }
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setConfig((prev) => ({
      ...prev,
      layouts: newLayout,
    }));
  }, []);

  const handleWidgetChange = useCallback((newWidgets: Widget[]) => {
    setConfig((prev) => ({
      ...prev,
      widgets: newWidgets,
    }));
  }, []);

  const addWidget = useCallback((widget: Widget) => {
    setConfig((prev) => ({
      layouts: [...prev.layouts, widget.layout],
      widgets: [...prev.widgets, widget],
    }));
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setConfig((prev) => ({
      layouts: prev.layouts.filter((layout) => layout.i !== widgetId),
      widgets: prev.widgets.filter((widget) => widget.id !== widgetId),
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(initialConfig);
    localStorage.removeItem(STORAGE_KEY);
  }, [initialConfig]);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  return {
    config,
    isEditing,
    handleLayoutChange,
    handleWidgetChange,
    addWidget,
    removeWidget,
    resetConfig,
    toggleEditing,
  };
} 