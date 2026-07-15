
import { queryKeys } from "@/query-keys";
import { socketInstance } from "@/sockets/instance";
import { EVENTS, type MessageEditedPayload, type SendMessagePayload, type TypingUpdatePayload } from "@/sockets/types";
import type { Message, DeleteMessageInput } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";



type MessagesChache = {
    messages: Message[];
    total: number
}

export const useChatSocket = (chatKey: string | undefined) => {
    const { id: workspaceId } = useParams<{ id: string }>();
    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!chatKey) return;

        const socket = socketInstance()
        const joinChatRoom = () => {
            socket.emit(EVENTS.ROOM_JOIN, { chatKey })
        }

        const onTyping = (payload: TypingUpdatePayload) => {
            if (payload.chatKey !== chatKey) return;
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                if (payload.isTyping) {
                    newMap.set(payload.userId, payload.name);
                } else {
                    newMap.delete(payload.userId);
                }
                return newMap;
            })
        }

        const onMsgReceive = (message: Message) => {
            if (message.chatKey !== chatKey) return;

            queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
                if (!old) return { messages: [message], total: 1 }
                if (old.messages.some(m => m.id === message.id)) return old;
                return {
                    messages: [...old.messages, message],
                    total: old.total + 1
                }
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(workspaceId!) })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
        };

        const onMsgEdit = (message: Message) => {
            if (message.chatKey !== chatKey) return;
            queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
                if (!old) return { messages: [message], total: 1 }
                const index = old.messages.findIndex(m => m.id === message.id);
                if (index !== -1) {
                    const updatedMessages = [...old.messages];
                    updatedMessages[index] = message;
                    return {
                        messages: updatedMessages,
                        total: old.total
                    }
                }
                return old;
            })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(workspaceId!) });
        }

        const onMsgDelete = (message: Message) => {
            console.log('onMsgDelete', message);
            if(message.chatKey !== chatKey) return;
            queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
                if(!old) return { messages: [message], total: 1 }
                const index = old.messages.findIndex(m => m.id === message.id);
                if(index !== -1) {
                    const updatedMessages = [...old.messages];
                    updatedMessages[index] = message;
                    return {
                        messages: updatedMessages,
                        total: old.total
                    }
                }
                return old;
            })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(workspaceId!) });
        }

        socket.on(EVENTS.TYPING_UPDATE, onTyping)
        socket.on(EVENTS.MESSAGE_RECEIVE, onMsgReceive)
        socket.on(EVENTS.MESSAGE_EDITED, onMsgEdit)
        socket.on(EVENTS.MESSAGE_DELETED, onMsgDelete)

        if (socket.connected) joinChatRoom()
        else {
            socket.connect()
            joinChatRoom()
        }

        return () => {
            socket.emit(EVENTS.ROOM_LEAVE, { chatKey });
            socket.off(EVENTS.MESSAGE_RECEIVE, onMsgReceive)
            socket.off(EVENTS.MESSAGE_EDITED, onMsgEdit)
            socket.off(EVENTS.MESSAGE_DELETED, onMsgDelete)
            socket.off(EVENTS.TYPING_UPDATE, onTyping)
            socket.emit(EVENTS.TYPING_STOP, { chatKey })
        }

    }, [chatKey, queryClient])

    const sendMessage = (input: SendMessagePayload) => {
        const socket = socketInstance()
        if (!socket.connected) socket.connect()
        socket.emit(EVENTS.MESSAGE_SEND, input)
    }

    const editMessage = (input: MessageEditedPayload) => {
        const socket = socketInstance()
        if(!socket.connected) socket.connect()
        socket.emit(EVENTS.MESSAGE_EDITED, input)
    }
    const deleteMessage = (input: DeleteMessageInput) => {
        const socket = socketInstance()
        if(!socket.connected) socket.connect()
        socket.emit(EVENTS.MESSAGE_DELETED, input)
    }
    return { sendMessage, editMessage, typingUsers, deleteMessage }
}