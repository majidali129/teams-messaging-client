import { authApi } from "@/api/services/auth";
import { signInPath } from "@/paths";
import { socketInstance } from "@/sockets/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries();
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("user");
      socketInstance().disconnect();
      toast.success("Logged out successfully");
      navigate(signInPath(), { replace: true });
      //   setTimeout(() => navigate(signInPath()), 500);
    },
    onError: (error) => {
      toast.error("Failed to logout");
      console.error(error);
    },
  });

  return { logout, isPending } as const;
};
