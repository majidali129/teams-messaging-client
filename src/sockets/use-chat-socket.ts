
import { queryKeys } from "@/query-keys";
import { socketInstance } from "@/sockets/instance";
import { EVENTS, type MessageEditedPayload, type SendMessagePayload, type TypingUpdatePayload } from "@/sockets/types";
import type { Message, DeleteMessageInput, ReadMessageInput } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";



export type MessagesChache = {
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
            console.log('onMsgReceive', message);

            queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
                if (!old) return { messages: [message], total: 1 }

                const isDuplicateOrOptimistic = old.messages.some(m =>
                    (message.clientMsgId && m.clientMsgId === message.clientMsgId)
                );
                const newMessages = old.messages.map(m => m.clientMsgId === message.clientMsgId ? { ...m, ...message, id: message.id, status: message.status } : m);
                return {
                    messages: newMessages,
                    total: isDuplicateOrOptimistic ? old.total : old.total + 1
                }
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
            // Chat-list previews (last message, ordering) are kept in sync by the
            // always-mounted useAppSocket listener, regardless of which chat is open.
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
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
            // Chat-list preview for an edited last message is kept in sync by
            // the always-mounted useAppSocket listener.
        }

        const onMsgDelete = (message: Message) => {
            console.log('onMsgDelete', message);
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
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.details(chatKey) });
            // Chat-list preview for a deleted last message is kept in sync by
            // the always-mounted useAppSocket listener.
        }

        const onMsgReadReceipt = (message: Message) => {
            console.log('onMsgReadReceipt', message);
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

        socket.on(EVENTS.TYPING_UPDATE, onTyping)
        socket.on(EVENTS.MESSAGE_RECEIVE, onMsgReceive)
        socket.on(EVENTS.MESSAGE_EDITED, onMsgEdit)
        socket.on(EVENTS.MESSAGE_DELETED, onMsgDelete)
        socket.on(EVENTS.MESSAGE_READ_RECEIPT, onMsgReadReceipt)
        if (socket.connected) joinChatRoom()
        else {
            socket.connect()
            joinChatRoom()
        }

        return () => {
            // Intentionally NOT emitting ROOM_LEAVE here: the server keeps every
            // participant's socket joined to all of their chat rooms for the
            // whole connection lifetime (see events-gateway.ts handleConnection),
            // so they keep getting message events for chat-list previews even
            // while this specific chat isn't open. Leaving here would evict them
            // from that room until their next reconnect.
            socket.off(EVENTS.MESSAGE_RECEIVE, onMsgReceive)
            socket.off(EVENTS.MESSAGE_EDITED, onMsgEdit)
            socket.off(EVENTS.MESSAGE_DELETED, onMsgDelete)
            socket.off(EVENTS.TYPING_UPDATE, onTyping)
            socket.off(EVENTS.MESSAGE_READ_RECEIPT, onMsgReadReceipt)
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
        if (!socket.connected) socket.connect()
        socket.emit(EVENTS.MESSAGE_EDITED, input)
    }
    const deleteMessage = (input: DeleteMessageInput) => {
        const socket = socketInstance()
        if (!socket.connected) socket.connect()
        socket.emit(EVENTS.MESSAGE_DELETED, input)
    }

    const emitReadMessage = (input: ReadMessageInput) => {
        const socket = socketInstance()
        if (!socket.connected) socket.connect()
        if (input.messageId === undefined || input.chatKey === undefined) return;
        socket.emit(EVENTS.MESSAGE_READ, input)
    }
    return { sendMessage, editMessage, typingUsers, deleteMessage, emitReadMessage }
}