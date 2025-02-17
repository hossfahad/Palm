'use client';

import { IconBuildingBank } from '@tabler/icons-react';

interface DAFIconProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export function DAFIcon({ className, size = 400, opacity = 0.4 }: DAFIconProps) {
  return (
    <div className={className} style={{ position: 'absolute', right: 0, top: 0, opacity }}>
      <IconBuildingBank size={size} stroke={1} />
    </div>
  );
} 