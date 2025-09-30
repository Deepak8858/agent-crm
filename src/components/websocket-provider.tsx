'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitUpdate: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  emitUpdate: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketIO = io(process.env.NODE_ENV === 'production' 
      ? 'wss://your-domain.com' 
      : 'http://localhost:3000', {
      path: '/api/socket',
    });

    socketIO.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socketIO.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    setSocket(socketIO);

    return () => {
      socketIO.close();
    };
  }, []);

  const emitUpdate = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, emitUpdate }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};