import type { Chat, CreateChatInput, DeleteMessageInput, Message } from "@/types";
import { httpClient } from "../client";



export const chatsApi = {
    getAll: (workspaceId: string) => httpClient.get<{chats: Chat[], total: number}>(`/chats?workspaceId=${workspaceId}`),
    getOne: (chatKey: string) => httpClient.get<Chat>(`/chats/${chatKey}`),
    create: (input: CreateChatInput) => httpClient.post<Chat>('/chats',input),
    getMessages: (chatKey: string) => httpClient.get<{messages: Message[], total: number}>(`/chats/${chatKey}/messages`),
    addParticipants: (chatId: string, participants: string[]) => httpClient.patch<Chat>(`/chats/${chatId}`, { participants }),
    deleteMessage: (input: DeleteMessageInput) => httpClient.patch<Message>(`/messages/${input.messageId}`, input),
}