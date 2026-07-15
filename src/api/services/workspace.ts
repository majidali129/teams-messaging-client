import type {
  CreateWorkspaceInput,
  UpdatePasswordInput,
  Workspace,
  WorkspaceDetails,
  WorkspaceMembers,
  Workspaces,
} from "@/types";
import { httpClient } from "../client";

export const workspaceApi = {
  getAll: () => httpClient.get<Workspaces>("/workspaces"),
  getById: (id: string) =>
    httpClient.get<WorkspaceDetails>(`/workspaces/${id}`),
  create: (input: CreateWorkspaceInput) =>
    httpClient.post<Workspace>("/workspaces", input),
  update: (id: string, input: UpdatePasswordInput) =>
    httpClient.patch<Workspace>(`/workspaces/${id}`, input),
  remove: (id: string) => httpClient.delete<void>(`/workspaces/${id}`),
  getMembers: (id: string) =>
    httpClient.get<WorkspaceMembers>(`/workspaces/${id}/members`),
  removeMember: (id: string , memberId: string) =>
    httpClient.delete<Workspace>(`/workspaces/${id}/members/${memberId}`),
};
