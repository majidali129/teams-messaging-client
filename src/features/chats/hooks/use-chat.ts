import { chatsApi } from "@/api/services/chats"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"

export const useChat = (chatKey: string) => {
    const {data: chat, isLoading, error} = useQuery({
        queryFn: () => chatsApi.getOne(chatKey),
        queryKey: queryKeys.chats.details(chatKey),
        enabled: !!chatKey
      })

      return {chat, isLoading, error} as const
}   