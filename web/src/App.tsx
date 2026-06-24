import ErrorBoundary from "./components/layout/ErrorBoundary";
import AppRouter from "./routes/AppRouter";
import { useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { bootstrapAuthFlow } from "@/features/auth/auth.api";
import { SquareSpin } from "./components/ui/square-spin";

function App() {
  const dispatch = useDispatch();
  const isBootstrapping = useSelector(
    (state: RootState) => state.auth.isBootstrapping
  );
  const hasBootstrapped = useRef(false)
  useEffect(() => {
    if(hasBootstrapped.current)return
    hasBootstrapped.current=true
    dispatch(bootstrapAuthFlow() as any);
  }, [dispatch]);
  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SquareSpin/>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <AppRouter  />
    </ErrorBoundary>
  );
}

export default App;