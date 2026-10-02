import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wear & Care uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] p-6 text-center">
          <div className="max-w-md p-8 bg-white border border-[#E5E0D5] rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-serif text-[#1A1A1A]">Something went wrong</h2>
            <p className="text-xs text-[#6B665E]">
              {this.state.error?.message || 'An unexpected error occurred while loading Wear & Care.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333333] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
