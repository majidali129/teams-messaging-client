import { useUser } from "@/features/auth/hooks/use-user";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signInPath } from "@/paths";
import { LoadingState } from "./loading-state";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate(signInPath());
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    <LoadingState
      title="Checking your account..."
      description="Please wait while we verify your credentials."
    />;

  if (isAuthenticated) return children;
};
