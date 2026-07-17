import type { AcceptInviteInput, AcceptInviteResponse, CreateInviteInput, Invite, InvitePreview, Invites } from "@/types";
import { httpClient } from "../client";


export const invitesApi = {
    getAll: (workspaceId:string) => httpClient.get<Invites>(`/invites?workspaceId=${workspaceId}`),
    create: (workspaceId: string, input: CreateInviteInput) => httpClient.post<Invite>(`/invites?workspaceId=${workspaceId}`, input),
    respond: ( inviteId: string, input: AcceptInviteInput) => httpClient.post<AcceptInviteResponse>(`/invites/${inviteId}/respond`, input),
    getReceived: () => httpClient.get<{invites: Invite[], total: number}>('/invites/received'),
    preview: (params: { token: string; inviteId: string }) =>
      httpClient.get<InvitePreview>(`/invites/preview?token=${encodeURIComponent(params.token)}&inviteId=${encodeURIComponent(params.inviteId)}`),
}
