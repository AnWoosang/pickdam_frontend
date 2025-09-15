import React from 'react';

// 개발 환경에서만 작동하는 성능 측정 도구
const isDev = process.env.NODE_ENV === 'development';

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration?: number;
}

class PerformanceTracker {
  private entries = new Map<string, PerformanceEntry>();

  start(name: string) {
    if (!isDev) return;
    
    this.entries.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  end(name: string) {
    if (!isDev) return;
    
    const entry = this.entries.get(name);
    if (!entry) return;
    
    const duration = performance.now() - entry.startTime;
    entry.duration = duration;
    
    // 500ms 이상 걸린 것만 로그
    if (duration > 500) {
      console.warn(`🐌 SLOW: ${name} took ${duration.toFixed(2)}ms`);
    } else if (duration > 100) {
      console.log(`⚠️  ${name} took ${duration.toFixed(2)}ms`);
    }
    
    this.entries.delete(name);
  }

  measure<T>(name: string, fn: () => T): T {
    if (!isDev) return fn();
    
    this.start(name);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!isDev) return fn();
    
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }
}

export const perf = new PerformanceTracker();

// React 컴포넌트 렌더링 시간 측정 HOC
export function withPerformanceTracking<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  if (!isDev) return Component;
  
  const name = componentName || Component.displayName || Component.name || 'Anonymous';
  
  return function PerformanceTrackedComponent(props: T) {
    perf.start(`Render: ${name}`);
    
    React.useEffect(() => {
      perf.end(`Render: ${name}`);
    });
    
    return React.createElement(Component, props);
  };
}