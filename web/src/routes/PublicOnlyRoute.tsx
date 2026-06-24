import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { SquareSpin } from "@/components/ui/square-spin";

function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useSelector(
    (state: RootState) => state.auth
  );
  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SquareSpin/>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
export default PublicOnlyRoute;