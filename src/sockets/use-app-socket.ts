
import { socketInstance } from "@/sockets/instance"
import { useEffect } from "react"
import { EVENTS, type InviteAcceptedPayload, type MemberRemovedPayload, type PresencePayload, type PresenceSnapshotPayload } from "./types"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/query-keys"
import type { Chat, Message } from "@/types"

type ChatsCache = { chats: Chat[]; total: number };

const workspaceIdFromChatKey = (chatKey: string) => chatKey.split(':')[0];


export const useAppSocket = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const currentSocket = socketInstance()

        const onConnect = () => {
            console.log('[socket] connected', currentSocket.id)
            currentSocket.emit(document.hidden ? EVENTS.PRESENCE_TAB_HIDDEN : EVENTS.PRESENCE_TAB_VISIBLE)
        }

        const onDisconnect = () => console.log('[socket] disconnected')

        const setOnline = (userId: string, isOnline: boolean) => {
            queryClient.setQueryData<Set<string>>(queryKeys.presence.snapshot(), (old) => {
                const next = new Set(old ?? []);
                if (isOnline) next.add(userId)
                else next.delete(userId)
                return next;
            })

        }
        const onPresenceOnline = (payload: PresencePayload) => {
            setOnline(payload.userId, true)
        }

        const onPresenceOffline = (payload: PresencePayload) => {
            setOnline(payload.userId, false)
        }

        const onPresenceSnapshot = (payload: PresenceSnapshotPayload) => {
            queryClient.setQueryData<Set<string>>(queryKeys.presence.snapshot(), () => new Set(payload.onlineUserIds))
        }

        const onVisibilityChange = () => {
            if(!currentSocket.connected) return;
            console.log('onVisibilityChange: ', document.hidden)
            currentSocket.emit(document.hidden ? EVENTS.PRESENCE_TAB_HIDDEN : EVENTS.PRESENCE_TAB_VISIBLE)
        }
        document.addEventListener('visibilitychange', onVisibilityChange)

        const onInviteAccepted = (payload: InviteAcceptedPayload) => {
            console.log(`${payload.name} has accepted your invite`)
            toast.info(`${payload.name} has joined the workspace`)
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(payload.workspaceId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(payload.workspaceId) })
            queryClient.invalidateQueries({queryKey: queryKeys.workspaces.members(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.all(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.received()})
        }

        const updateChatsCache = (
            chatKey: string,
            updater: (chat: Chat) => Chat,
            options?: { bumpToTop?: boolean },
        ) => {
            queryClient.setQueryData<ChatsCache>(
                queryKeys.chats.all(workspaceIdFromChatKey(chatKey)),
                (old) => {
                    if (!old) return old;
                    const index = old.chats.findIndex((c) => c.chatKey === chatKey);
                    if (index === -1) return old;
                    const updatedChat = updater(old.chats[index]);
                    if (!options?.bumpToTop) {
                        const chats = [...old.chats];
                        chats[index] = updatedChat;
                        return { ...old, chats };
                    }
                    const chats = old.chats.filter((_, i) => i !== index);
                    chats.unshift(updatedChat);
                    return { ...old, chats };
                },
            );
        };

        const onMessageReceive = (message: Message) => {
            updateChatsCache(
                message.chatKey,
                (chat) => ({
                    ...chat,
                    lastMessage: {
                        id: message.id,
                        type: message.type,
                        content: message.content,
                        createdAt: message.createdAt,
                        sender: message.sender,
                        attachments: message.attachments,
                    },
                    updatedAt: message.createdAt,
                }),
                { bumpToTop: true },
            );
        };

        const onMessageEdited = (message: Message) => {
            updateChatsCache(message.chatKey, (chat) =>
                chat.lastMessage?.id === message.id
                    ? { ...chat, lastMessage: { ...chat.lastMessage, content: message.content } }
                    : chat,
            );
        };

        const onMessageDeleted = (message: Message) => {
            updateChatsCache(message.chatKey, (chat) =>
                chat.lastMessage?.id === message.id
                    ? { ...chat, lastMessage: { ...chat.lastMessage, content: "" } }
                    : chat,
            );
        };

        const onMemberRemoved = (payload: MemberRemovedPayload) => {
            toast.error(`${payload.name} has left the workspace`)
            console.log(`${payload.name} has left the workspace`)
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(payload.workspaceId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(payload.workspaceId) })
            queryClient.invalidateQueries({queryKey: queryKeys.workspaces.members(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.all(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.received()})
        }

        currentSocket.on(EVENTS.PRESENCE_ONLINE, onPresenceOnline)
        currentSocket.on(EVENTS.PRESENCE_OFFLINE, onPresenceOffline)
        currentSocket.on(EVENTS.PRESENCE_SNAPSHOT, onPresenceSnapshot)
        currentSocket.on(EVENTS.INVITE_ACCEPTED, onInviteAccepted)
        currentSocket.on(EVENTS.MEMBER_REMOVED, onMemberRemoved)
        currentSocket.on(EVENTS.MESSAGE_RECEIVE, onMessageReceive)
        currentSocket.on(EVENTS.MESSAGE_EDITED, onMessageEdited)
        currentSocket.on(EVENTS.MESSAGE_DELETED, onMessageDeleted)

        currentSocket.on('connect', onConnect)
        currentSocket.on('disconnect', onDisconnect)

        if (!currentSocket.connected) currentSocket.connect()
            else onVisibilityChange()

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
            currentSocket.off('connect', onConnect)
            currentSocket.off('disconnect', onDisconnect)
            currentSocket.off(EVENTS.PRESENCE_ONLINE, onPresenceOnline)
            currentSocket.off(EVENTS.PRESENCE_OFFLINE, onPresenceOffline)
            currentSocket.off(EVENTS.PRESENCE_SNAPSHOT, onPresenceSnapshot)
            currentSocket.off(EVENTS.INVITE_ACCEPTED, onInviteAccepted)
            currentSocket.off(EVENTS.MEMBER_REMOVED, onMemberRemoved)
            currentSocket.off(EVENTS.MESSAGE_RECEIVE, onMessageReceive)
            currentSocket.off(EVENTS.MESSAGE_EDITED, onMessageEdited)
            currentSocket.off(EVENTS.MESSAGE_DELETED, onMessageDeleted)
        }
    }, [])
}