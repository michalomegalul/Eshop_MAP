import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const addNotification = useCallback((message: string, type: NotificationType, duration = 5000) => {
    const id = idCounter;
    setIdCounter(prev => prev + 1);

    setNotifications(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [idCounter]);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Notification UI component
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-md flex items-start justify-between transition-all transform translate-y-0 opacity-100 
            ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : ''}
            ${notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500' : ''}`}
          role="alert"
        >
          <div className="flex-1 mr-2">{notification.message}</div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
