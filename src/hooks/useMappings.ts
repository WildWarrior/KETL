import { useState } from 'react';
import { Schema } from '../types/schema';

interface Mapping {
  start: string;
  end: string;
}

export const useMappings = () => {
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'link';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const sourceColumnId = e.dataTransfer.getData('text/plain');
    
    if (sourceColumnId === targetColumnId) return;
    
    const mappingExists = mappings.some(
      mapping => mapping.start === sourceColumnId && mapping.end === targetColumnId
    );
    
    if (!mappingExists) {
      setMappings(prev => [...prev, { start: sourceColumnId, end: targetColumnId }]);
    }
  };

  const handleDeleteMapping = (mappingIndex: number) => {
    setMappings(prevMappings => prevMappings.filter((_, index) => index !== mappingIndex));
  };

  return {
    mappings,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDeleteMapping
  };
}; 