import ErrorBoundary from "./components/layout/ErrorBoundary";
import AppRouter
  from "./routes/AppRouter";

function App() {

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;