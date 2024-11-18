import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { SchemaTable } from '../components/mapping/SchemaTable';
import { useSchemas } from '../context/SchemaContext';
import { MappingInfo } from '../features/schemaMapping/components/MappingInfo';

interface Mapping {
  sourceId: string;
  targetId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

export const DataMapping = () => {
  const { sourceSchema, destSchema } = useSchemas();
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [currentLine, setCurrentLine] = useState<{
    sourceId: string;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<{ [key: string]: HTMLElement }>({});

  useEffect(() => {
    const handleResize = () => {
      updateMappingPositions();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mappings]);

  const updateMappingPositions = () => {
    setMappings(prevMappings => 
      prevMappings.map(mapping => ({
        ...mapping,
        startPoint: getElementCenter(columnRefs.current[mapping.sourceId], 'source'),
        endPoint: getElementCenter(columnRefs.current[mapping.targetId], 'target')
      }))
    );
  };

  const getElementCenter = (element: HTMLElement, side: 'source' | 'target' = 'source') => {
    if (!element || !svgRef.current) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    
    return {
      x: side === 'source' 
        ? rect.right - svgRect.left  // Right side of source
        : rect.left - svgRect.left,  // Left side of target
      y: rect.top + rect.height/2 - svgRect.top
    };
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    const element = columnRefs.current[columnId];
    if (!element) return;

    const startPoint = getElementCenter(element, 'source');
    setCurrentLine({
      sourceId: columnId,
      startPoint,
      endPoint: startPoint
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!currentLine || !svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    setCurrentLine(prev => ({
      ...prev!,
      endPoint: {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top
      }
    }));
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!currentLine) return;

    const targetElement = columnRefs.current[targetId];
    if (!targetElement) return;

    const endPoint = getElementCenter(targetElement, 'target');

    const mappingExists = mappings.some(
      m => m.sourceId === currentLine.sourceId && m.targetId === targetId
    );

    if (!mappingExists) {
      setMappings(prev => [...prev, {
        sourceId: currentLine.sourceId,
        targetId,
        startPoint: currentLine.startPoint,
        endPoint
      }]);
    }

    setCurrentLine(null);
  };

  const setRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      columnRefs.current[id] = element;
    }
  };

  const generatePath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const controlPoint1X = start.x + (end.x - start.x) / 2;
    const controlPoint2X = controlPoint1X;
    return `M ${start.x} ${start.y} 
            C ${controlPoint1X} ${start.y},
              ${controlPoint2X} ${end.y},
              ${end.x} ${end.y}`;
  };

  const handleDeleteMapping = (index: number) => {
    setMappings(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '240px',
        mt: 4,
        position: 'relative',
        minHeight: '500px'
      }}
    >
      {/* Source Schema */}
      <Box>
        {sourceSchema && (
          <SchemaTable
            schema={sourceSchema}
            side="source"
            setRef={setRef}
            onDragStart={handleDragStart}
          />
        )}
      </Box>

      {/* SVG Layer for Lines */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {mappings.map((mapping, index) => (
          <g key={`mapping-${index}`}>
            <path
              d={generatePath(mapping.startPoint, mapping.endPoint)}
              fill="none"
              stroke="#2196f3"
              strokeWidth="2"
            />
            <polygon
              points={`${mapping.endPoint.x},${mapping.endPoint.y} 
                      ${mapping.endPoint.x - 8},${mapping.endPoint.y - 4} 
                      ${mapping.endPoint.x - 8},${mapping.endPoint.y + 4}`}
              fill="#2196f3"
            />
          </g>
        ))}

        {currentLine && (
          <path
            d={generatePath(currentLine.startPoint, currentLine.endPoint)}
            fill="none"
            stroke="#2196f3"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {/* Target Schema */}
      <Box onDragOver={handleDragOver}>
        {destSchema && (
          <SchemaTable
            schema={destSchema}
            side="destination"
            setRef={setRef}
            onDrop={handleDrop}
          />
        )}
      </Box>

      {/* Add MappingInfo component */}
      <MappingInfo
        mappings={mappings}
        sourceSchema={sourceSchema}
        targetSchema={destSchema}
        onDeleteMapping={handleDeleteMapping}
      />
    </Box>
  );
};