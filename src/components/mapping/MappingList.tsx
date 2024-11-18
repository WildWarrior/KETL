import React from 'react';
import { Mapping } from '../../types/mapping';

interface MappingListProps {
  mappings: Mapping[];
  onDelete: (index: number) => void;
}

export const MappingList: React.FC<MappingListProps> = ({ mappings, onDelete }) => {
  return (
    <div>
      {/* Add your mapping list implementation */}
      {mappings.map((mapping, index) => (
        <div key={index}>
          {mapping.start} → {mapping.end}
          <button onClick={() => onDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}; 