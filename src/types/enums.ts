// `erasableSyntaxOnly` disallows real TS enums, so we use the
// "as const object + derived union" pattern instead. Usage stays the same:
// `WorkspaceRole.owner` as a value, `WorkspaceRole` as a type.

// Mirrors api/src/workspaces/constants/workspace-role.ts
export const WorkspaceRole = {
  owner: "owner",
  guest: "guest",
  member: "member",
} as const;
export type WorkspaceRole = (typeof WorkspaceRole)[keyof typeof WorkspaceRole];

// Mirrors api/src/workspaces/constants/workspace-status.ts
export const WorkspaceStatus = {
  active: "active",
  archived: "archived",
  deleted: "deleted",
} as const;
export type WorkspaceStatus = (typeof WorkspaceStatus)[keyof typeof WorkspaceStatus];

// Mirrors api/src/invites/constants/status.ts
export const InviteStatus = {
  pending: "pending",
  accepted: "accepted",
  declined: "declined",
  expired: "expired",
  revoked: "revoked",
} as const;
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];

// Mirrors api/src/chats/constants/message-status.ts
export const MessageStatus = {
  delivered: "delivered",
  pending: "pending",
  read: "read",
  unread: "unread",
} as const;
export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

// Mirrors api/src/chats/constants/message-attachment.ts
export const MessageAttachmentType = {
  image: "image",
  video: "video",
  audio: "audio",
  document: "document",
} as const;
export type MessageAttachmentType =
  (typeof MessageAttachmentType)[keyof typeof MessageAttachmentType];
