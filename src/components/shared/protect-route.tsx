
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signInPath } from "@/paths";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access-token')
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(signInPath(), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return children;
};
