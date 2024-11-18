import React, { createContext, useContext, useState } from 'react';
import { Schema } from '../types/schema';

type DialogType = 'source' | 'destination' | null;

interface SchemaContextType {
  sourceSchema: Schema | null;
  destSchema: Schema | null;
  openDialog: DialogType;
  setOpenDialog: (type: DialogType) => void;
  handleSaveSchema: (schemaData: { name: string; columns: any[]; schemaType: DialogType }) => void;
  getSchemaByType: (type: DialogType) => Schema | null;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export const SchemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sourceSchema, setSourceSchema] = useState<Schema | null>(null);
  const [destSchema, setDestSchema] = useState<Schema | null>(null);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const getSchemaByType = (type: DialogType) => {
    if (type === 'source') return sourceSchema;
    if (type === 'destination') return destSchema;
    return null;
  };

  const handleSaveSchema = (schemaData: { 
    name: string; 
    columns: any[]; 
    schemaType: DialogType 
  }) => {
    const newSchema: Schema = {
      id: Date.now().toString(),
      name: schemaData.name,
      columns: schemaData.columns.map(col => ({
        id: col.id || Date.now().toString() + Math.random(),
        name: col.name,
        type: col.type
      }))
    };

    if (schemaData.schemaType === 'source') {
      setSourceSchema(newSchema);
    } else if (schemaData.schemaType === 'destination') {
      setDestSchema(newSchema);
    }
    
    setOpenDialog(null);
  };

  return (
    <SchemaContext.Provider 
      value={{ 
        sourceSchema, 
        destSchema, 
        openDialog, 
        setOpenDialog, 
        handleSaveSchema,
        getSchemaByType 
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
};

export const useSchemas = () => {
  const context = useContext(SchemaContext);
  if (context === undefined) {
    throw new Error('useSchemas must be used within a SchemaProvider');
  }
  return context;
};

export { SchemaContext }; 