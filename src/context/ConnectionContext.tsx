import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
type Connection = {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
};

type ConnectionContextType = {
  connections: Connection[];
  addConnection: (connection: any) => void;
  updateConnection: (id: string, connection: any) => void;
  deleteConnection: (id: string) => void;
};

// Create context
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// Create provider component
export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('connections');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever connections change
  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [connections]);

  const addConnection = (connection: any) => {
    const newConnection = {
      ...connection,
      id: Date.now().toString(),
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const updateConnection = (id: string, updatedConnection: any) => {
    setConnections(prev =>
      prev.map(conn => (conn.id === id ? { ...conn, ...updatedConnection } : conn))
    );
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  };

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        addConnection,
        updateConnection,
        deleteConnection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

// Create hook for using the context
export function useConnections() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
} 