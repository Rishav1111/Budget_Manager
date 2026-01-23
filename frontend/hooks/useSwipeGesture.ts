import { useRef, useState, TouchEvent } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  preventDefault?: boolean;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventDefault = true,
}: SwipeGestureOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setIsSwiping(true);
    setSwipeDistance(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Only consider horizontal swipes (ignore if vertical movement is greater)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDistance(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current) return;

    const distance = swipeDistance;
    const absDistance = Math.abs(distance);

    if (absDistance >= threshold) {
      if (distance < 0 && onSwipeLeft) {
        // Swiped left
        onSwipeLeft();
      } else if (distance > 0 && onSwipeRight) {
        // Swiped right
        onSwipeRight();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isSwiping,
    swipeDistance,
  };
}
