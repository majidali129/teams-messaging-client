import { chatsApi } from "@/api/services/chats"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

export const useWorkspaceChats = () => {
    const {id: workspaceId} = useParams()
    const {data, isLoading, error} = useQuery({
      queryFn: () => chatsApi.getAll(workspaceId!),
      queryKey: queryKeys.chats.all(workspaceId!),
      enabled: !!workspaceId
    })

      return {chats: data?.chats ?? [],
        total: data?.total ?? 0, isLoading, error} as const
}   