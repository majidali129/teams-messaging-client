
import { socketInstance } from "@/sockets/instance"
import { useEffect } from "react"
import { EVENTS, type InviteAcceptedPayload, type MemberRemovedPayload, type PresencePayload } from "./types"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/query-keys"


export const useAppSocket = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const currentSocket = socketInstance()

        const onConnect = () => console.log('[socket] connected', currentSocket.id)
        const onDisconnect = () => console.log('[socket] disconnected')
        const onPresenceOnline = (payload: PresencePayload) => {
            toast.info(`${payload.name} is online`)
            console.log('onPresenceOnline: ', payload)
        }

        const onInviteAccepted = (payload: InviteAcceptedPayload) => {
            console.log(`${payload.name} has accepted your invite`)
            toast.info(`${payload.name} has joined the workspace`)
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(payload.workspaceId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(payload.workspaceId) })
            queryClient.invalidateQueries({queryKey: queryKeys.workspaces.members(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.all(payload.workspaceId)})
            queryClient.invalidateQueries({queryKey: queryKeys.invites.received()})
        }

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
        currentSocket.on(EVENTS.INVITE_ACCEPTED, onInviteAccepted)
        currentSocket.on(EVENTS.MEMBER_REMOVED, onMemberRemoved)

        currentSocket.on('connect', onConnect)
        currentSocket.on('disconnect', onDisconnect)

        if (!currentSocket.connected) currentSocket.connect()
        return () => {
            currentSocket.off('connect', onConnect)
            currentSocket.off('disconnect', onDisconnect)
            currentSocket.off(EVENTS.PRESENCE_ONLINE, onPresenceOnline)
            currentSocket.off(EVENTS.INVITE_ACCEPTED, onInviteAccepted)
            currentSocket.off(EVENTS.MEMBER_REMOVED, onMemberRemoved)
        }
    }, [])
}