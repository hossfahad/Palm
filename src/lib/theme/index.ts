import { createTheme, rem } from '@mantine/core';
import { colors } from './colors';

export const theme = createTheme({
  primaryColor: 'sage',
  colors: colors,
  fontFamily: 'var(--font-inter)',
  defaultRadius: 'md',
  white: colors.gray[0],
  black: colors.gray[6],

  shadows: {
    xs: '0 1px 2px rgba(42, 46, 51, 0.05)',
    sm: '0 1px 3px rgba(42, 46, 51, 0.1)',
    md: '0 3px 6px rgba(42, 46, 51, 0.1)',
    lg: '0 5px 15px rgba(42, 46, 51, 0.1)',
    xl: '0 10px 24px rgba(42, 46, 51, 0.1)',
  },

  headings: {
    fontFamily: 'var(--font-inter)',
    sizes: {
      h1: { fontSize: rem(36) },
      h2: { fontSize: rem(30) },
      h3: { fontSize: rem(24) },
      h4: { fontSize: rem(20) },
      h5: { fontSize: rem(16) },
      h6: { fontSize: rem(14) },
    },
  },

  other: {
    transition: {
      default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fast: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
}); 