import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app_connections';

export const useConnections = () => {
  const [connections, setConnections] = useState<any[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }, [connections]);

  const addConnection = (connection: any) => {
    setConnections(prev => [...prev, { ...connection, id: Date.now().toString() }]);
  };

  const updateConnection = (id: string, connection: any) => {
    setConnections(prev => 
      prev.map(conn => conn.id === id ? { ...conn, ...connection } : conn)
    );
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  };

  return {
    connections,
    addConnection,
    updateConnection,
    deleteConnection
  };
}; 