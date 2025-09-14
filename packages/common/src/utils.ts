import type { FrameworkDetection } from './types';

export function detectFramework(): FrameworkDetection | null {
  try {
    // Check for Next.js
    if (require.resolve('next')) {
      return { framework: 'nextjs' };
    }
  } catch {}

  try {
    // Check for Remix
    if (require.resolve('@remix-run/node') || require.resolve('@remix-run/dev')) {
      return { framework: 'remix' };
    }
  } catch {}

  try {
    // Check for Vue
    if (require.resolve('vue')) {
      return { framework: 'vue' };
    }
  } catch {}

  try {
    // Check for React
    if (require.resolve('react')) {
      return { framework: 'react' };
    }
  } catch {}

  try {
    // Check for Express
    if (require.resolve('express')) {
      return { framework: 'express' };
    }
  } catch {}

  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}