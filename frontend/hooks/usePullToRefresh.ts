'use client';

import { useState, useEffect, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => void | Promise<void>;
  enabled?: boolean;
  threshold?: number; // Distance in pixels to trigger refresh
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
}

export function usePullToRefresh({
  onRefresh,
  enabled = true,
  threshold = 80,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || window.scrollY > 0) return;
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    },
    [enabled],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isPulling || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);

      if (distance > 0) {
        e.preventDefault(); // Prevent default scroll behavior
        setPullDistance(Math.min(distance, threshold * 2)); // Cap at 2x threshold
      }
    },
    [enabled, isPulling, startY, threshold],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Error refreshing:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [enabled, isPulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Reset pull distance when refreshing completes
  useEffect(() => {
    if (!isRefreshing && pullDistance > 0) {
      const timer = setTimeout(() => {
        setPullDistance(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing, pullDistance]);

  return { pullDistance, isRefreshing };
}
