import {
  Component,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary
  extends Component<
    Props,
    State
  > {

  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {

    return {
      hasError: true,
    };
  }

  render() {

    if (
      this.state
        .hasError
    ) {
      return (
        <div className="p-8 text-center">

          <h2>
            Something went wrong
          </h2>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;