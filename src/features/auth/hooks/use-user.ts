import { usersApi } from "@/api/services/users"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useUser = () => {
    const {data, isLoading, error} = useQuery({
        queryKey: queryKeys.users.current,
        queryFn: () => usersApi.getCurrentUser(),
        retry: false,
    },
)

    return {
        isAuthenticated: !!data && !error,
        isLoading,
        error,
        user: data,
    }
}