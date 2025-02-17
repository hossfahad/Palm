'use client';

import { Stack, Text } from '@mantine/core';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Logo({ size = 'md', color }: LogoProps) {
  const sizes = {
    sm: {
      title: 'text-xl',
      subtitle: 'text-xs',
    },
    md: {
      title: 'text-2xl',
      subtitle: 'text-sm',
    },
    lg: {
      title: 'text-3xl',
      subtitle: 'text-base',
    },
  };

  return (
    <Stack gap={0} className={inter.className}>
      <Text
        className={sizes[size].title}
        fw={700}
        style={{ color: color || 'var(--mantine-color-sage-7)' }}
      >
        Palm
      </Text>
      <Text
        className={sizes[size].subtitle}
        c="dimmed"
        tt="uppercase"
        fw={500}
        style={{ letterSpacing: '0.1em' }}
      >
        Philanthropy
      </Text>
    </Stack>
  );
} 