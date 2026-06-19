import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../services/user.service";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.me();

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}