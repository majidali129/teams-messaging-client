import { chatsApi } from "@/api/services/chats";
import { queryKeys } from "@/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useDeleteMessage = (chatKey: string, onSuccess: () => void) => {
    const queryClient = useQueryClient();
    const { mutate: deleteMessage, isPending } = useMutation({
        mutationFn: chatsApi.deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.messages(chatKey) });
            onSuccess();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete message");
        },
    });

    return { deleteMessage, isPending };
};