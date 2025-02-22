import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { DashboardShell } from '@/components/layout/dashboard-shell';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Palm Philanthropy",
  description: "Empowering philanthropic giving through technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <DashboardShell>{children}</DashboardShell>
        </Providers>
      </body>
    </html>
  );
} 