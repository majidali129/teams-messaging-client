export const EVENTS = {
    ROOM_JOIN: "room:join",
    ROOM_LEAVE: "room:leave",
    MESSAGE_SEND: "message:send",
    MESSAGE_RECEIVE: "message:receive",
    PRESENCE_ONLINE: "presence:online",
    PRESENCE_OFFLINE: "presence:offline",
    TYPING_START: "typing:start",
TYPING_STOP: "typing:stop",
TYPING_UPDATE: "typing:update"
} as const;


export interface PresencePayload {
    userId: string;
    name: string;
}

export interface TypingUpdatePayload {
    chatKey: string;
    userId: string;
    name: string;
    isTyping: boolean;
}