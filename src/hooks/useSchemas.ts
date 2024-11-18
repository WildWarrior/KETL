import { useState } from 'react';
import { Schema } from '../types/schema';

type DialogType = 'source' | 'destination' | null;

export const useSchemas = () => {
  const [sourceSchema, setSourceSchema] = useState<Schema | null>(null);
  const [destSchema, setDestSchema] = useState<Schema | null>(null);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const handleSaveSchema = (schemaData: { name: string; columns: any[] }) => {
    console.log('Saving schema data:', schemaData);

    const newSchema: Schema = {
      id: Date.now().toString(),
      name: schemaData.name,
      columns: schemaData.columns.map(col => ({
        id: Date.now().toString() + Math.random(),
        name: col.name,
        type: col.type
      }))
    };

    console.log('Created schema:', newSchema);

    if (openDialog === 'source') {
      console.log('Setting source schema');
      setSourceSchema(newSchema);
    } else if (openDialog === 'destination') {
      console.log('Setting destination schema');
      setDestSchema(newSchema);
    }
    setOpenDialog(null);
  };

  console.log('Current schemas:', { sourceSchema, destSchema });

  return {
    sourceSchema,
    destSchema,
    openDialog,
    setOpenDialog,
    handleSaveSchema,
    getInitialValues: () => ({
      name: '',
      columns: [{ name: '', type: '' }]
    })
  };
}; 