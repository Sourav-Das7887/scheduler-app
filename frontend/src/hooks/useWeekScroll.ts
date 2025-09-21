// src/hooks/useWeekScroll.ts
import { useEffect } from "react";

export const useWeekScroll = (
  containerRef: React.RefObject<HTMLDivElement>,
  loadNextWeek: () => void,
  loadPreviousWeek: () => void
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    let lastScrollTop = containerRef.current.scrollTop;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // scroll down -> next week
        loadNextWeek();
      } else if (scrollTop <= 10) {
        // scroll up -> previous week
        loadPreviousWeek();
      }

      lastScrollTop = scrollTop;
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, loadNextWeek, loadPreviousWeek]);
};
