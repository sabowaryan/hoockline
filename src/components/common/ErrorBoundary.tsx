import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  redirectFailed: boolean;
}

// Wrapper component to use hooks in class component
function ErrorBoundaryWrapper({ children, fallback }: Props) {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary navigate={navigate} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

class ErrorBoundary extends Component<Props & { navigate: (path: string) => void }, State> {
  constructor(props: Props & { navigate: (path: string) => void }) {
    super(props);
    this.state = { hasError: false, redirectFailed: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, redirectFailed: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Determine the type of error and redirect accordingly
    this.handleErrorRedirect(error);
  }

  handleErrorRedirect(error: Error) {
    const { navigate } = this.props;
    
    try {
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('network')) {
        navigate('/error');
        return;
      }
      
      // Check if it's an authentication error
      if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        navigate('/error');
        return;
      }
      
      // Check if it's a permission error
      if (error.message.includes('permission') || error.message.includes('forbidden')) {
        navigate('/error');
        return;
      }
      
      // Check if it's a test error (for testing purposes)
      if (error.message.includes('Test error triggered')) {
        navigate('/error');
        return;
      }
      
      // Default to error page for other types
      navigate('/error');
    } catch (redirectError) {
      // If redirection fails, we'll show the fallback UI
      console.error('Failed to redirect to error page:', redirectError);
      this.setState({ redirectFailed: true });
    }
  }

  render() {
    if (this.state.hasError && this.state.redirectFailed) {
      // Only show fallback UI if redirection failed
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-6 sm:py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mx-auto blur-xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-6">
              OOPS
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Une erreur inattendue s'est produite
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Désolé, quelque chose s'est mal passé. Nous avons été notifiés et travaillons à résoudre le problème.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualiser la page</span>
              </button>
              
              <button
                onClick={() => this.props.navigate('/')}
                className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Retour à l'accueil</span>
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <summary className="cursor-pointer font-semibold text-gray-900 mb-4">
                  Détails de l'erreur (développement)
                </summary>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Message d'erreur:</h4>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-1">
                      {this.state.error.message}
                    </p>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900">Stack trace:</h4>
                      <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mt-1 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundaryWrapper as ErrorBoundary }; 