export type FrameworkType = 'react' | 'nextjs' | 'vue' | 'remix' | 'express';

export interface FrameworkDetection {
  framework: FrameworkType;
  version?: string;
}

export interface BundleMetrics {
  size: number;
  gzipSize: number;
  modules: number;
  chunks: number;
}