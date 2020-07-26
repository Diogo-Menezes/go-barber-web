import React from 'react';
import { uuid } from 'uuidv4';
// eslint-disable-next-line import/no-cycle
import ToastContainer from '../components/toast/container';

export interface ToastMessage {
  id: string;
  type?: 'info' | 'success' | 'error';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(toast: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = React.createContext<ToastContextData>(
  {} as ToastContextData,
);

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = React.useCallback(id => {
    setToasts(state => state.filter(toast => toast.id !== id));
  }, []);

  const addToast = React.useCallback((message: Omit<ToastMessage, 'id'>) => {
    const toast = {
      id: uuid(),
      title: message.title,
      description: message.description,
      type: message.type,
    };

    setToasts(state => [...state, toast]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('Must implement Toast Provider');
  }

  return context;
}
