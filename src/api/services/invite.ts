import type { AcceptInviteInput, CreateInviteInput, Invite, Invites } from "@/types";
import { httpClient } from "../client";


export const invitesApi = {
    getAll: (workspaceId:string) => httpClient.get<Invites>(`/invites?workspaceId=${workspaceId}`),
    create: (workspaceId: string, input: CreateInviteInput) => httpClient.post<Invite>(`/invites?workspaceId=${workspaceId}`, input),
    respond: ( inviteId: string, input: AcceptInviteInput) => httpClient.post<Invite>(`/invites/${inviteId}/respond`, input),
    getReceived: () => httpClient.get<{invites: Invite[], total: number}>('/invites/received'),
}