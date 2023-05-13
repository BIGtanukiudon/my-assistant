import { useCallback } from "react";

type UseScroll = {
  scrollDownToTargetElement: (targetElementId: string) => void;
};

export const useScroll = (): UseScroll => {
  const scrollDownToTargetElement = useCallback((targetElementId: string) => {
    const scrollArea = document.getElementById(targetElementId);

    if (scrollArea === null) return;

    const scrollHeight = scrollArea.scrollHeight;
    scrollArea.scrollTop = scrollHeight;

    scrollArea.scroll();
  }, []);

  return {
    scrollDownToTargetElement,
  };
};
