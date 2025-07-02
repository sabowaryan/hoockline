import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface ErrorInfo {
  type: 'network' | 'auth' | 'permission' | 'validation' | 'server' | 'unknown';
  message: string;
  details?: string;
  code?: string;
}

export function useErrorHandler() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleError = useCallback((error: Error | string | ErrorInfo) => {
    let errorInfo: ErrorInfo;

    if (typeof error === 'string') {
      errorInfo = {
        type: 'unknown',
        message: error
      };
    } else if (error instanceof Error) {
      // Determine error type based on error message
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorInfo = {
          type: 'network',
          message: error.message,
          details: error.stack
        };
      } else if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        errorInfo = {
          type: 'auth',
          message: error.message,
          details: error.stack
        };
      } else if (error.message.includes('permission') || error.message.includes('forbidden')) {
        errorInfo = {
          type: 'permission',
          message: error.message,
          details: error.stack
        };
      } else if (error.message.includes('validation')) {
        errorInfo = {
          type: 'validation',
          message: error.message,
          details: error.stack
        };
      } else {
        errorInfo = {
          type: 'unknown',
          message: error.message,
          details: error.stack
        };
      }
    } else {
      errorInfo = error;
    }

    // Log error for debugging
    console.error('Error handled by useErrorHandler:', errorInfo);

    // Redirect based on error type
    switch (errorInfo.type) {
      case 'network':
      case 'server':
        navigate('/error');
        break;
      case 'auth':
        navigate('/error');
        break;
      case 'permission':
        navigate('/error');
        break;
      case 'validation':
        // For validation errors, we might want to show a notification instead of redirecting
        console.warn('Validation error:', errorInfo.message);
        break;
      default:
        navigate('/error');
        break;
    }

    return errorInfo;
  }, [navigate]);

  const handleNetworkError = useCallback((error: Error) => {
    handleError({
      type: 'network',
      message: t('error.network.message', { defaultValue: 'Network error occurred' }),
      details: error.message
    });
  }, [handleError, t]);

  const handleAuthError = useCallback((error: Error) => {
    handleError({
      type: 'auth',
      message: t('error.auth.message', { defaultValue: 'Authentication error occurred' }),
      details: error.message
    });
  }, [handleError, t]);

  const handlePermissionError = useCallback((error: Error) => {
    handleError({
      type: 'permission',
      message: t('error.permission.message', { defaultValue: 'Permission denied' }),
      details: error.message
    });
  }, [handleError, t]);

  const handleServerError = useCallback((error: Error) => {
    handleError({
      type: 'server',
      message: t('error.server.message', { defaultValue: 'Server error occurred' }),
      details: error.message
    });
  }, [handleError, t]);

  const handleValidationError = useCallback((message: string) => {
    handleError({
      type: 'validation',
      message
    });
  }, [handleError]);

  return {
    handleError,
    handleNetworkError,
    handleAuthError,
    handlePermissionError,
    handleServerError,
    handleValidationError
  };
} 