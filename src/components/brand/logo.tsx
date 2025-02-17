import { Group, Text } from '@mantine/core';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Logo({ size = 'md', color }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Group gap={4} className={inter.className}>
      <Text
        className={sizes[size]}
        style={{ color: color || 'var(--mantine-color-sage-7)' }}
      >
        Palm
      </Text>
      <Text
        className={sizes[size]}
        style={{ color: color || 'var(--mantine-color-sage-7)' }}
      >
        Philanthropy
      </Text>
    </Group>
  );
} 