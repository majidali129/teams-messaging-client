import { authApi } from "@/api/services/auth"
import { signInPath } from "@/paths";
import { queryKeys } from "@/query-keys";
import { socketInstance } from "@/sockets/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router";
import { toast } from "sonner";


export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const {mutate: logout, isPending} = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.users.current })
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                socketInstance().disconnect();
                toast.success('Logged out successfully')
                setTimeout(() => navigate(signInPath()), 500)
        },
        onError: (error) => {
            toast.error('Failed to logout')
            console.error(error)
        }
    })

    return {logout, isPending} as const
}