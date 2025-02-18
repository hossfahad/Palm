import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './providers';

export const metadata = {
  title: 'Palm Philanthropy',
  description: 'Empowering charitable giving through technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 