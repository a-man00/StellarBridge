"use client";

import React, { Component, ReactNode } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught ErrorBoundary error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-xl px-4">
          <Card className="text-center border-l-4 border-l-error">
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription className="mt-2">
              An unexpected application error occurred. You can retry loading
              the component or navigate back to safety.
            </CardDescription>

            {this.state.error && (
              <Alert tone="error" className="mt-4 text-left font-mono text-xs">
                {this.state.error.message}
              </Alert>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={this.handleReset}>Try Again</Button>
              <Button variant="secondary" onClick={() => (window.location.href = "/home")}>
                Return Home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
