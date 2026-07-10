import type { CreateWorkspaceInput, UpdatePasswordInput, Workspace } from "@/types";
import { httpClient } from "../client";



export const workspaceApi = {
    getAll: () => httpClient.get<Workspace[]>('/workspaces'),
    getById: (id: string) => httpClient.get<Workspace>(`/workspaces/${id}`),
    create: (input: CreateWorkspaceInput) => httpClient.post<Workspace>('/workspaces',input),
    update: (id: string, input: UpdatePasswordInput) => httpClient.patch<Workspace>(`/workspaces/${id}`, input),
    remove: (id: string) => httpClient.delete<void>(`/workspaces/${id}`)
}