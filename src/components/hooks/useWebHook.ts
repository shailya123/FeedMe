
'use client'
import { useEffect, useRef } from 'react';

interface MessageHandler {
  (message: any): void;
}

const useWebSocket = (onMessage: MessageHandler, username?: string) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      socketRef.current = new WebSocket('ws://localhost:9000');

      // socketRef.current.onopen = () => {
      //   socketRef.current?.send(JSON.stringify({ type: '', username }));
      // };

      socketRef.current.onmessage = (event: MessageEvent) => {
        if (typeof event.data === 'string') {
          try {
            const message = JSON.parse(event.data);
            onMessage(message);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else if (event.data instanceof Blob) {
          console.log('Received Blob data:', event.data);
          const reader = new FileReader();
          reader.onload = () => {
            const messageText = reader.result as string;
            console.log('Blob text:', messageText);
            try {
              const message = JSON.parse(messageText);
              onMessage(message);
            } catch (error) {
              console.error('Error parsing JSON from Blob:', error);
            }
          };
          reader.readAsText(event.data);
        } else {
          console.warn('Unsupported message type:', event.data);
        }
      };

      socketRef.current.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current.onclose = (event: CloseEvent) => {
        console.log('WebSocket closed:', event);
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [onMessage]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. ReadyState:', socketRef.current?.readyState);
    }
  };

  return sendMessage;
};

export default useWebSocket;
