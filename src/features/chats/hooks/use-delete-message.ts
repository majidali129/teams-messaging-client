import { chatsApi } from "@/api/services/chats";
import { queryKeys } from "@/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteMessage = (chatKey: string, onSuccess: () => void) => {
    const queryClient = useQueryClient();
    const { mutate: deleteMessage, isPending } = useMutation({
        mutationFn: chatsApi.deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.messages(chatKey) });
            onSuccess();
        },
    });

    return { deleteMessage, isPending };
};