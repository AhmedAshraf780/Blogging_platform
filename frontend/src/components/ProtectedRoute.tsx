import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
