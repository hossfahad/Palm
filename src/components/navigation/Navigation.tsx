"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Stack, ActionIcon, Tooltip } from '@mantine/core';
import { IconHome, IconUsers, IconHeart, IconSettings } from '@tabler/icons-react';
import { cn } from "@/lib/utils";

interface NavigationProps {
  userRole?: "advisor" | "client";
}

export default function Navigation({ userRole = "advisor" }: NavigationProps) {
  const pathname = usePathname();

  const advisorLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: IconHome
    },
    {
      href: "/dashboard/clients",
      label: "Clients",
      icon: IconUsers
    },
    {
      href: "/dashboard/causes",
      label: "Causes",
      icon: IconHeart
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: IconSettings
    },
  ];

  const clientLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: IconHome
    },
    {
      href: "/dashboard/causes",
      label: "Causes",
      icon: IconHeart
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: IconSettings
    },
  ];

  const links = userRole === "advisor" ? advisorLinks : clientLinks;

  return (
    <Stack 
      h="100%" 
      py="md" 
      px="xs" 
      style={{
        backgroundColor: 'white',
        width: '4rem',
        borderRight: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Stack gap="lg" align="center">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} passHref>
              <Tooltip 
                label={link.label} 
                position="right"
              >
                <ActionIcon
                  variant={pathname === link.href ? 'filled' : 'subtle'}
                  aria-label={link.label}
                  size="xl"
                  color="dark"
                >
                  <Icon size={24} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
} 