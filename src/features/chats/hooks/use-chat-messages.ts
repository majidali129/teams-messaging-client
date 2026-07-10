import { chatsApi } from "@/api/services/chats"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"

export const useChatMessages = (chatKey: string) => {
  const { data, isLoading, error } = useQuery({
    queryFn: () => chatsApi.getMessages(chatKey),
    queryKey: queryKeys.chats.messages(chatKey),
    enabled: !!chatKey
  })

  return {
    messages: data?.messages ?? [],
    total: data?.total ?? 0, isLoading, error
  } as const
}   