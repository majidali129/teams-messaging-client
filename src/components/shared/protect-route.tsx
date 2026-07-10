import { useUser } from "@/features/auth/hooks/use-user";
import { useEffect } from "react"
import { Navigate,  } from "react-router";
import { signInPath } from "@/paths";


export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      <Navigate to={signInPath()} replace />;
    }
  }, [isAuthenticated]);

  return (
    <>
      {children}
    </>
  )
}