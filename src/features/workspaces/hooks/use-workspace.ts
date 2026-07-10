import { workspaceApi } from "@/api/services/workspace"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

export const useWorkspace = () => {
    const {id} = useParams()
    const {data: workspace, isLoading, error} = useQuery({
        queryFn: () => workspaceApi.getById(id!),
        queryKey: queryKeys.workspaces.details(id!),
        enabled: !!id
      })

      return {workspace, isLoading, error} as const
}   