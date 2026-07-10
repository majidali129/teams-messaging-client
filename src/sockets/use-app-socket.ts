
import { socketInstance } from "@/sockets/instance"
import { useEffect } from "react"
import { EVENTS, type PresencePayload } from "./types"
import { toast } from "sonner"


export const useAppSocket = () => {

    useEffect(() => {
        const currentSocket = socketInstance()

        const onConnect = () => console.log('[socket] connected', currentSocket.id)
        const onDisconnect = () => console.log('[socket] disconnected')
        const onPresenceOnline = (payload: PresencePayload) => toast.info(`${payload.name} is online`)

        currentSocket.on('connect', onConnect)
        currentSocket.on(EVENTS.PRESENCE_ONLINE, onPresenceOnline)
        currentSocket.on('disconnect', onDisconnect)

        if (!currentSocket.connected) currentSocket.connect()
        return () => {
            currentSocket.off('connect', onConnect)
            currentSocket.off(EVENTS.PRESENCE_ONLINE, onPresenceOnline)
            currentSocket.off('disconnect', onDisconnect)
        }
    }, [])
}