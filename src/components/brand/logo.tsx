import { Group, Text } from '@mantine/core';
import { Inter } from 'next/font/google';
import { IconLeaf } from '@tabler/icons-react';

const inter = Inter({ subsets: ['latin'] });

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  minimal?: boolean;
}

export function Logo({ size = 'md', color, minimal = false }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  if (minimal) {
    return (
      <Text
        className={`${sizes[size]} ${inter.className}`}
        style={{ color: color || 'var(--mantine-color-dark-9)' }}
      >
        P
      </Text>
    );
  }

  return (
    <Group gap="xs" align="center" className={inter.className}>
      <IconLeaf size={iconSizes[size]} style={{ color: color || 'var(--mantine-color-dark-9)' }} />
      <Text
        className={sizes[size]}
        style={{ 
          color: color || 'var(--mantine-color-dark-9)',
          fontWeight: 400
        }}
      >
        Palm
      </Text>
    </Group>
  );
} 