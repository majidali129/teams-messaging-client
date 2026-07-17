import type { MessageAttachment, WorkspaceRole } from "@/types";

export const EVENTS = {
    ROOM_JOIN: "room:join",
    ROOM_LEAVE: "room:leave",
    MESSAGE_SEND: "message:send",
    MESSAGE_RECEIVE: "message:receive",
    PRESENCE_ONLINE: "presence:online",
    PRESENCE_OFFLINE: "presence:offline",
    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",
    TYPING_UPDATE: "typing:update",
    INVITE_ACCEPTED: "invite:accepted",
    INVITE_DECLINED: "invite:declined",
    MEMBER_REMOVED: "member:removed",
    MESSAGE_EDITED: "message:edited",
    MESSAGE_DELETED: "message:deleted",
    MESSAGE_READ: "message:read",
    MESSAGE_READ_RECEIPT: "message:read:receipt",
} as const;


export interface PresencePayload {
    roomKey: string;
    userId: string;
    name: string;
}

export interface InviteAcceptedPayload {
    roomKey: string;
    userId: string;
    workspaceId: string
    name: string;
    role: WorkspaceRole;
}

export interface TypingUpdatePayload {
    chatKey: string;
    userId: string;
    name: string;
    isTyping: boolean;
}

export interface MemberRemovedPayload {
    workspaceId: string;
    roomKey: string;
    userId: string;
    name: string;
}

export interface SendMessagePayload {
    clientMsgId: string;
    chatKey: string;
    content: string;
    mentions?: string[];
    attachments?: MessageAttachment[]
}

export interface MessageEditedPayload extends SendMessagePayload {
    messageId: string;
}

export interface MessageReadPayload {
    userId: string;
    readAt: Date;
    messageId: string;
}