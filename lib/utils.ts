import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
}

export function generateOrderId(): string {
  return 'RS-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function calculateDiscount(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}

export const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Accessories'] as const;
export type Category = typeof CATEGORIES[number];

export const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
