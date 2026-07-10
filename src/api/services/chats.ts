import type { Chat, CreateChatInput, Message } from "@/types";
import { httpClient } from "../client";



export const chatsApi = {
    getAll: (workspaceId: string) => httpClient.get<{chats: Chat[], total: number}>(`/chats?workspaceId=${workspaceId}`),
    getOne: (chatKey: string) => httpClient.get<Chat>(`/chats/${chatKey}`),
    create: (input: CreateChatInput) => httpClient.post<Chat>('/chats',input),
    getMessages: (chatKey: string) => httpClient.get<{messages: Message[], total: number}>(`/chats/${chatKey}/messages`),
}