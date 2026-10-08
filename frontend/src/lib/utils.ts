import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals: number = 1): string {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getBandDetails(score: number) {
  if (score < 5.3) {
    return {
      band: 'Needs Attention',
      color: '#EF4444',
      bgLight: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
      textClass: 'text-red-400',
      badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
      gradient: 'from-red-500 to-rose-600',
    };
  } else if (score < 6.6) {
    return {
      band: 'Moderate',
      color: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      textClass: 'text-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      gradient: 'from-amber-500 to-orange-500',
    };
  } else if (score < 7.9) {
    return {
      band: 'Good',
      color: '#10B981',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      textClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      gradient: 'from-emerald-500 to-teal-500',
    };
  } else {
    return {
      band: 'Thriving',
      color: '#8B5CF6',
      bgLight: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.3)',
      textClass: 'text-purple-400',
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      gradient: 'from-purple-500 to-indigo-500',
    };
  }
}
