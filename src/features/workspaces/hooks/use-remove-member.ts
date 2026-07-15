import { workspaceApi } from "@/api/services/workspace";
import { queryKeys } from "@/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";


export const useRemoveMember = () => {
    const queryClient = useQueryClient();
    const {id: workspaceId} = useParams<{id: string}>();
    if (!workspaceId) throw new Error('Workspace ID is required');
    const {mutate: removeMember, isPending} = useMutation({
        mutationFn: (memberId: string) => workspaceApi.removeMember(workspaceId!, memberId),
        onSuccess: () => {
            toast.success('Member removed from workspace successfully');
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all});
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(workspaceId)});
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(workspaceId)});
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to remove member from workspace');
        },
    });
    return {removeMember, isPending};
}