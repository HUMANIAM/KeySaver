/**
 * Error Boundary Component
 * WHY: Catch React errors and prevent full app crashes
 * BENEFIT: Graceful error handling, better UX, easier debugging
 * USAGE: Wrap components that might fail
 */
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary catches errors in child components and displays a fallback UI
 * instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development (in production, send to error tracking service)
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Store error details in state for display
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <Card className="max-w-lg w-full shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We're sorry, but something unexpected happened. The error has been logged
                and we'll look into it.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
                    <p className="font-mono text-xs text-red-800 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <p className="font-mono text-xs text-red-700 mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </p>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simplified Error Fallback component for inline errors
 */
export function ErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error.message}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
