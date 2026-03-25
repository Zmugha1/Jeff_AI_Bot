import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function getHealthStatusColor(status: string): string {
  switch (status) {
    case 'on_track':
      return 'bg-emerald-100 text-emerald-700';
    case 'attention':
      return 'bg-amber-100 text-amber-700';
    case 'action_required':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function getTrendColor(trend: number): string {
  return trend >= 0 ? 'text-emerald-600' : 'text-red-600';
}

export function getTrendIcon(trend: number): string {
  return trend >= 0 ? '↑' : '↓';
}
