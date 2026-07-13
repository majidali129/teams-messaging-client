import { workspaceApi } from "@/api/services/workspace"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useWorkspaces = () => {
    const {data, isLoading, error} = useQuery({
        queryFn: workspaceApi.getAll,
        queryKey: queryKeys.workspaces.all
      })

      return {data: data ?? {workspaces: [], totalCount: 0}, isLoading, error} as const
}