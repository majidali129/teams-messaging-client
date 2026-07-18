
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signInPath } from "@/paths";
import { useUser } from "@/features/auth/hooks/use-user";
import { CurrentUserProvider } from "@/features/auth/context/current-user-context";
import { LoadingState } from "./loading-state";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(signInPath(), { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingState title="Loading your account" description="Please wait while we load your account" className="h-screen" />;
  }

  if (!isAuthenticated || !user) return null;
  return <CurrentUserProvider user={user}>{children}</CurrentUserProvider>;
};
