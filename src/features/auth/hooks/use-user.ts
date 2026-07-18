import { usersApi } from "@/api/services/users"
import { queryKeys } from "@/query-keys"
import type { User } from "@/types"
import { useQuery } from "@tanstack/react-query"


export const useUser = () => {
    const {data: user, isLoading, error} = useQuery({
        queryKey: queryKeys.users.current,
        queryFn: () => usersApi.getCurrentUser(),
        initialData: () => {
            const cached = localStorage.getItem('user');
            return cached ? (JSON.parse(cached) as User) : undefined;
        },
        retry: false,
    })

    return {
        isAuthenticated: !!user && !error,
        isLoading,
        error,
        user,
    }
}