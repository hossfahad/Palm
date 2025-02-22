import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
} 