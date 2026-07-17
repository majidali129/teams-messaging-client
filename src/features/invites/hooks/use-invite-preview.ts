import { invitesApi } from "@/api/services/invite";
import { queryKeys } from "@/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useInvitePreview = (token: string | null, inviteId: string | null) => {
  return useQuery({
    queryKey: queryKeys.invites.preview(token ?? '', inviteId ?? ''),
    queryFn: () => invitesApi.preview({ token: token!, inviteId: inviteId! }),
    enabled: !!token && !!inviteId,
    retry: false,
  });
};
