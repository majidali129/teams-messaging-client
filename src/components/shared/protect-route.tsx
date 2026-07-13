import { useUser } from "@/features/auth/hooks/use-user";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signInPath } from "@/paths";
import { LoadingState } from "./loading-state";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate(signInPath(), { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <LoadingState
        title="Checking your account..."
        description="Please wait while we verify your credentials."
      />
    );

  if (!isAuthenticated) {
    return null;
  }

  return children;
};
