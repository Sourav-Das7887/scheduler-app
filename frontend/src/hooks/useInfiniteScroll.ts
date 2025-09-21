// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef, useCallback, useState } from 'react';

export const useInfiniteScroll = (callback: () => void, hasMore: boolean, isLoading: boolean) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        if (entry.isIntersecting && hasMore && !isLoading) {
          callbackRef.current();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading]);

  return observerRef;
};