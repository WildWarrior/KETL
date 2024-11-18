import { useState, useCallback } from 'react';

export const useArrows = () => {
  const [elementRefs, setElementRefs] = useState<{ [key: string]: HTMLElement }>({});

  const setRef = useCallback((id: string, ref: HTMLElement | null) => {
    if (ref) {
      setElementRefs(prev => {
        if (prev[id] === ref) return prev;
        return { ...prev, [id]: ref };
      });
    }
  }, []);

  const getElementCoordinates = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const renderXarrow = useCallback(({ start, end }: { start: string; end: string }) => {
    const startElement = elementRefs[start];
    const endElement = elementRefs[end];

    if (!startElement || !endElement) return null;

    const startCoords = getElementCoordinates(startElement);
    const endCoords = getElementCoordinates(endElement);

    if (
      isNaN(startCoords.x) || 
      isNaN(startCoords.y) || 
      isNaN(endCoords.x) || 
      isNaN(endCoords.y)
    ) {
      return null;
    }

    return {
      startElement,
      endElement,
      startCoords,
      endCoords
    };
  }, [elementRefs, getElementCoordinates]);

  return {
    elementRefs,
    setRef,
    renderXarrow
  };
}; 