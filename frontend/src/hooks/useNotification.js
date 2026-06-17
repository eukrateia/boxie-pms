import { useState, useCallback } from 'react';

export function useNotification() {
  const [notification, setNotification] = useState(null);

  const show = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const showError = useCallback((message) => show(message, 'error'), [show]);
  const showSuccess = useCallback((message) => show(message, 'success'), [show]);
  const showWarning = useCallback((message) => show(message, 'warning'), [show]);

  return { notification, showError, showSuccess, showWarning, clear: () => setNotification(null) };
}
