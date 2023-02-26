import React, { ErrorInfo, ReactElement, ReactNode } from 'react'
import { Text, View } from 'react-native'

type ErrorBoundaryState = {
  error?: Error
}

export type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactElement
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error: any): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text>Something happened!</Text>
            <Text>{this.state.error.toString()}</Text>
          </View>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
