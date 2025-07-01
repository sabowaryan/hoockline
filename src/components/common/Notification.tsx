import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  show?: boolean;
  id?: string;
}

const notificationStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700'
  }
};

export function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  show = true 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const styles = notificationStyles[type];
  const IconComponent = styles.icon;

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
      isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 shadow-lg`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.titleColor}`}>
              {title}
            </h4>
            {message && (
              <p className={`text-sm mt-1 ${styles.messageColor}`}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer les notifications
export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'show'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, show: true };
    
    setNotifications(prev => [...prev, { ...newNotification, id }]);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

// Composant pour afficher toutes les notifications
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification, index) => (
        <div key={notification.id || index} style={{ top: `${4 + index * 80}px` }}>
          <Notification
            {...notification}
            onClose={() => removeNotification(notification.id || index.toString())}
          />
        </div>
      ))}
    </>
  );
} 