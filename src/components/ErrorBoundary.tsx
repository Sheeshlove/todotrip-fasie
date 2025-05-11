import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-todoBlack flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-todoDarkGray rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Что-то пошло не так</h1>
            <p className="text-todoMediumGray mb-6">
              {this.state.error?.message || 'Произошла непредвиденная ошибка'}
            </p>
            <Button
              variant="outline"
              className="border-todoYellow text-todoYellow"
              onClick={() => window.location.reload()}
            >
              Перезагрузить страницу
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;