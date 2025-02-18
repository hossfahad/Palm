import { Group, Text } from '@mantine/core';
import { Inter } from 'next/font/google';

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

  if (minimal) {
    return (
      <Text
        className={`${sizes[size]} ${inter.className}`}
        style={{ color: color || 'var(--mantine-color-sage-7)' }}
      >
        P
      </Text>
    );
  }

  return (
    <Group gap={4} className={inter.className}>
      <Text
        className={sizes[size]}
        style={{ 
          color: color || 'var(--mantine-color-sage-7)',
          fontWeight: 400
        }}
      >
        Palm
      </Text>
      <Text
        className={sizes[size]}
        style={{ 
          color: color || 'var(--mantine-color-sage-7)',
          fontWeight: 400
        }}
      >
        Philanthropy
      </Text>
    </Group>
  );
} 