import React, { Component, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Define common errors and their user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  'NetworkError': 'Проблема с сетевым подключением. Пожалуйста, проверьте ваше интернет-соединение.',
  'AuthError': 'Ошибка авторизации. Пожалуйста, войдите снова.',
  'PermissionError': 'У вас нет доступа к этому ресурсу.',
  'ServerError': 'Произошла ошибка на сервере. Мы работаем над ее устранением.',
  'default': 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.'
};

// Log error to monitoring service (placeholder function)
const logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
  // In production, you would send this to a real error monitoring service
  console.error('Error details for monitoring:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error but don't expose details to user
    logErrorToService(error, errorInfo);
  }

  // Get user-friendly error message based on error type
  private getUserFriendlyMessage(): string {
    if (!this.state.error) return ERROR_MESSAGES.default;
    
    // Check if error contains known error keywords
    const errorString = this.state.error.message.toLowerCase();
    
    if (errorString.includes('network') || errorString.includes('failed to fetch')) {
      return ERROR_MESSAGES.NetworkError;
    }
    
    if (errorString.includes('authentication') || 
        errorString.includes('auth') || 
        errorString.includes('unauthorized') ||
        errorString.includes('not logged in')) {
      return ERROR_MESSAGES.AuthError;
    }
    
    if (errorString.includes('permission') || 
        errorString.includes('forbidden') || 
        errorString.includes('access denied')) {
      return ERROR_MESSAGES.PermissionError;
    }
    
    if (errorString.includes('server') || errorString.includes('500')) {
      return ERROR_MESSAGES.ServerError;
    }
    
    return ERROR_MESSAGES.default;
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-todoBlack flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-todoDarkGray rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
            <p className="text-todoMediumGray mb-6">
              {this.getUserFriendlyMessage()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-todoYellow text-todoYellow"
                onClick={() => window.location.reload()}
              >
                Перезагрузить страницу
              </Button>
              <Button
                variant="outline"
                className="border-todoYellow text-todoYellow"
                onClick={() => window.location.href = '/'}
              >
                Вернуться на главную
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 