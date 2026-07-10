import { workspaceApi } from "@/api/services/workspace"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useWorkspaces = () => {
    const {data: workspaces, isLoading, error} = useQuery({
        queryFn: workspaceApi.getAll,
        queryKey: queryKeys.workspaces.all
      })

      return {workspaces, isLoading, error} as const
}