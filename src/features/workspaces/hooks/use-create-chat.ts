import { chatsApi } from "@/api/services/chats";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";


export const useCreateChat = (memberId: string) => {
    const {id: workspaceId} = useParams();
    const navigate = useNavigate();
    const {mutate: createChat, isPending} = useMutation({
        mutationFn: () => chatsApi.create({
          workspaceId: workspaceId!,
          isChannel: false,
          participants: [memberId],
        }),
        onSuccess: (data) => {
          navigate(`/workspaces/${workspaceId}/chats?chat=${data.chatKey}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create chat");
        },
      })
      return {createChat, isPending}
};