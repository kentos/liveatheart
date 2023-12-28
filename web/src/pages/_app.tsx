import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Component, type ErrorInfo } from "react";
import { Albert_Sans } from "next/font/google";

const font = Albert_Sans({ subsets: ["latin-ext"], variable: "--font-albert" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);

class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("ERROR BOUNDARY", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("ERROR BOUNDARY", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }
    return this.props.children;
  }
}
