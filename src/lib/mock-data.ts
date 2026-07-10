import {
  WorkspaceRole,
  WorkspaceStatus,
  InviteStatus,
  MessageStatus,
  MessageAttachmentType,
  type User,
  type Workspace,
  type Invite,
  type Chat,
  type Message,
} from "@/types";

/**
 * Static, hand-authored fixtures used to build the UI without a live backend.
 * Data is intentionally normalized (separate user/workspace/chat/message
 * collections joined by id) to mirror how the real API will shape responses.
 */

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const CURRENT_USER_ID = "user-1";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex.morgan@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=12", publicId: "avatar-1" },
    createdAt: "2024-01-05T09:00:00.000Z",
    updatedAt: "2024-01-05T09:00:00.000Z",
  },
  {
    id: "user-2",
    name: "Priya Sharma",
    email: "priya.sharma@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=32", publicId: "avatar-2" },
    createdAt: "2024-01-08T09:00:00.000Z",
    updatedAt: "2024-01-08T09:00:00.000Z",
  },
  {
    id: "user-3",
    name: "Daniel Kim",
    email: "daniel.kim@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=51", publicId: "avatar-3" },
    createdAt: "2024-01-10T09:00:00.000Z",
    updatedAt: "2024-01-10T09:00:00.000Z",
  },
  {
    id: "user-4",
    name: "Sofia Rossi",
    email: "sofia.rossi@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=45", publicId: "avatar-4" },
    createdAt: "2024-01-12T09:00:00.000Z",
    updatedAt: "2024-01-12T09:00:00.000Z",
  },
  {
    id: "user-5",
    name: "Marcus Lee",
    email: "marcus.lee@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=15", publicId: "avatar-5" },
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "user-6",
    name: "Hannah Becker",
    email: "hannah.becker@acme.com",
    avatar: { url: "https://i.pravatar.cc/150?img=47", publicId: "avatar-6" },
    createdAt: "2024-01-18T09:00:00.000Z",
    updatedAt: "2024-01-18T09:00:00.000Z",
  },
];

export const getUserById = (id: string | undefined): User | undefined =>
  id ? mockUsers.find((user) => user.id === id) : undefined;

// ---------------------------------------------------------------------------
// Workspaces
// ---------------------------------------------------------------------------

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Product Team",
    ownerId: "user-1",
    status: WorkspaceStatus.active,
    members: [
      { userId: "user-1", role: WorkspaceRole.owner, joinedAt: "2024-01-05T09:00:00.000Z" },
      { userId: "user-2", role: WorkspaceRole.member, joinedAt: "2024-01-09T09:00:00.000Z" },
      { userId: "user-3", role: WorkspaceRole.member, joinedAt: "2024-01-11T09:00:00.000Z" },
      { userId: "user-4", role: WorkspaceRole.guest, joinedAt: "2024-01-20T09:00:00.000Z" },
    ],
    createdAt: "2024-01-05T09:00:00.000Z",
    updatedAt: "2024-02-01T09:00:00.000Z",
  },
  {
    id: "ws-2",
    name: "Design Guild",
    ownerId: "user-2",
    status: WorkspaceStatus.active,
    members: [
      { userId: "user-2", role: WorkspaceRole.owner, joinedAt: "2024-01-08T09:00:00.000Z" },
      { userId: "user-1", role: WorkspaceRole.member, joinedAt: "2024-01-10T09:00:00.000Z" },
      { userId: "user-5", role: WorkspaceRole.member, joinedAt: "2024-01-16T09:00:00.000Z" },
    ],
    createdAt: "2024-01-08T09:00:00.000Z",
    updatedAt: "2024-01-30T09:00:00.000Z",
  },
  {
    id: "ws-3",
    name: "Marketing Hub",
    ownerId: "user-4",
    status: WorkspaceStatus.active,
    members: [
      { userId: "user-4", role: WorkspaceRole.owner, joinedAt: "2024-01-12T09:00:00.000Z" },
      { userId: "user-1", role: WorkspaceRole.member, joinedAt: "2024-01-14T09:00:00.000Z" },
      { userId: "user-6", role: WorkspaceRole.member, joinedAt: "2024-01-19T09:00:00.000Z" },
    ],
    createdAt: "2024-01-12T09:00:00.000Z",
    updatedAt: "2024-01-28T09:00:00.000Z",
  },
  {
    id: "ws-4",
    name: "Customer Success",
    ownerId: "user-1",
    status: WorkspaceStatus.active,
    members: [
      { userId: "user-1", role: WorkspaceRole.owner, joinedAt: "2024-01-06T09:00:00.000Z" },
      { userId: "user-3", role: WorkspaceRole.member, joinedAt: "2024-01-13T09:00:00.000Z" },
    ],
    createdAt: "2024-01-06T09:00:00.000Z",
    updatedAt: "2024-01-25T09:00:00.000Z",
  },
  {
    id: "ws-5",
    name: "Engineering",
    ownerId: "user-5",
    status: WorkspaceStatus.active,
    members: [
      { userId: "user-5", role: WorkspaceRole.owner, joinedAt: "2024-01-15T09:00:00.000Z" },
      { userId: "user-1", role: WorkspaceRole.guest, joinedAt: "2024-01-22T09:00:00.000Z" },
      { userId: "user-2", role: WorkspaceRole.member, joinedAt: "2024-01-17T09:00:00.000Z" },
      { userId: "user-3", role: WorkspaceRole.member, joinedAt: "2024-01-18T09:00:00.000Z" },
      { userId: "user-6", role: WorkspaceRole.member, joinedAt: "2024-01-21T09:00:00.000Z" },
    ],
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2024-02-02T09:00:00.000Z",
  },
  {
    id: "ws-6",
    name: "Acme Archive",
    ownerId: "user-1",
    status: WorkspaceStatus.archived,
    members: [
      { userId: "user-1", role: WorkspaceRole.owner, joinedAt: "2023-11-01T09:00:00.000Z" },
      { userId: "user-4", role: WorkspaceRole.member, joinedAt: "2023-11-05T09:00:00.000Z" },
    ],
    createdAt: "2023-11-01T09:00:00.000Z",
    updatedAt: "2023-12-15T09:00:00.000Z",
  },
];

export const getWorkspaceById = (id: string | undefined): Workspace | undefined =>
  id ? mockWorkspaces.find((workspace) => workspace.id === id) : undefined;

/** Workspaces the current user owns or belongs to, most-recently-updated first. */
export const myWorkspaces = mockWorkspaces
  .filter((workspace) => workspace.members.some((member) => member.userId === CURRENT_USER_ID))
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const getMyRoleInWorkspace = (workspace: Workspace): WorkspaceRole | undefined =>
  workspace.members.find((member) => member.userId === CURRENT_USER_ID)?.role;

// ---------------------------------------------------------------------------
// Invites
// ---------------------------------------------------------------------------

export const mockInvites: Invite[] = [
  // Sent by ws-1 owner (current user) — shown on the workspace Invites tab
  {
    id: "inv-1",
    workspaceId: "ws-1",
    email: "noah.wilson@acme.com",
    role: WorkspaceRole.member,
    status: InviteStatus.pending,
    invitedBy: "user-1",
    expiresAt: "2024-03-01T09:00:00.000Z",
    acceptedAt: null,
    createdAt: "2024-02-10T09:00:00.000Z",
    updatedAt: "2024-02-10T09:00:00.000Z",
  },
  {
    id: "inv-2",
    workspaceId: "ws-1",
    email: "sofia.rossi@acme.com",
    role: WorkspaceRole.guest,
    status: InviteStatus.accepted,
    invitedBy: "user-1",
    expiresAt: "2024-01-25T09:00:00.000Z",
    acceptedAt: "2024-01-20T09:00:00.000Z",
    createdAt: "2024-01-18T09:00:00.000Z",
    updatedAt: "2024-01-20T09:00:00.000Z",
  },
  {
    id: "inv-3",
    workspaceId: "ws-1",
    email: "old.contractor@acme.com",
    role: WorkspaceRole.member,
    status: InviteStatus.expired,
    invitedBy: "user-1",
    expiresAt: "2024-01-05T09:00:00.000Z",
    acceptedAt: null,
    createdAt: "2023-12-20T09:00:00.000Z",
    updatedAt: "2024-01-05T09:00:00.000Z",
  },
  {
    id: "inv-4",
    workspaceId: "ws-1",
    email: "revoked.user@acme.com",
    role: WorkspaceRole.guest,
    status: InviteStatus.revoked,
    invitedBy: "user-1",
    expiresAt: "2024-02-15T09:00:00.000Z",
    acceptedAt: null,
    createdAt: "2024-02-01T09:00:00.000Z",
    updatedAt: "2024-02-05T09:00:00.000Z",
  },
  // Received by the current user — shown in the top-nav invites notification
  {
    id: "inv-5",
    workspaceId: "ws-3",
    email: "alex.morgan@acme.com",
    role: WorkspaceRole.member,
    status: InviteStatus.pending,
    invitedBy: "user-4",
    expiresAt: "2024-03-10T09:00:00.000Z",
    acceptedAt: null,
    createdAt: "2024-02-20T09:00:00.000Z",
    updatedAt: "2024-02-20T09:00:00.000Z",
  },
  {
    id: "inv-6",
    workspaceId: "ws-2",
    email: "alex.morgan@acme.com",
    role: WorkspaceRole.guest,
    status: InviteStatus.pending,
    invitedBy: "user-2",
    expiresAt: "2024-03-12T09:00:00.000Z",
    acceptedAt: null,
    createdAt: "2024-02-22T09:00:00.000Z",
    updatedAt: "2024-02-22T09:00:00.000Z",
  },
];

export const getInvitesForWorkspace = (workspaceId: string): Invite[] =>
  mockInvites.filter((invite) => invite.workspaceId === workspaceId);

/** Pending invites addressed to the current user's email (any workspace). */
export const myReceivedInvites = mockInvites.filter(
  (invite) =>
    invite.email === getUserById(CURRENT_USER_ID)?.email &&
    invite.status === InviteStatus.pending
);

// ---------------------------------------------------------------------------
// Chats
// ---------------------------------------------------------------------------

export const mockChats: Chat[] = [
  {
    id: "chat-1",
    chatKey: "ws-1:general",
    workspaceId: "ws-1",
    name: "general",
    isChannel: true,
    lastMessageId: "msg-9",
    participants: ["user-1", "user-2", "user-3", "user-4"],
    createdAt: "2024-01-05T10:00:00.000Z",
    updatedAt: "2024-02-14T15:32:00.000Z",
  },
  {
    id: "chat-2",
    chatKey: "ws-1:design-reviews",
    workspaceId: "ws-1",
    name: "design-reviews",
    isChannel: true,
    lastMessageId: undefined,
    participants: ["user-1", "user-2", "user-4"],
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-01-22T11:00:00.000Z",
  },
  {
    id: "chat-3",
    chatKey: "ws-1:user-1:user-2",
    workspaceId: "ws-1",
    isChannel: false,
    lastMessageId: "msg-12",
    participants: ["user-1", "user-2"],
    createdAt: "2024-01-11T10:00:00.000Z",
    updatedAt: "2024-02-13T09:05:00.000Z",
  },
  {
    id: "chat-4",
    chatKey: "ws-1:user-1:user-3",
    workspaceId: "ws-1",
    isChannel: false,
    lastMessageId: undefined,
    participants: ["user-1", "user-3"],
    createdAt: "2024-01-16T10:00:00.000Z",
    updatedAt: "2024-01-16T10:00:00.000Z",
  },
];

export const getChatsForWorkspace = (workspaceId: string): Chat[] =>
  mockChats.filter((chat) => chat.workspaceId === workspaceId);

/** Display name for a chat — the channel name, or the other participant's name for a DM. */
export const getChatDisplayName = (chat: Chat): string => {
  if (chat.isChannel) return chat.name ?? "unnamed-channel";
  const otherUserId = chat.participants.find((id) => id !== CURRENT_USER_ID);
  return getUserById(otherUserId)?.name ?? "Direct message";
};

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export const mockMessages: Message[] = [
  // chat-1 (#general) — plain conversation with reactions + mention
  {
    id: "msg-1",
    content: "Welcome to #general! Let's kick off the sprint planning here.",
    status: MessageStatus.read,
    senderId: "user-1",
    chatKey: "ws-1:general",
    readBy: ["user-2", "user-3", "user-4"],
    readAt: "2024-02-10T09:05:00.000Z",
    createdAt: "2024-02-10T09:00:00.000Z",
    updatedAt: "2024-02-10T09:00:00.000Z",
    reactions: ["👍", "🎉"],
  },
  {
    id: "msg-2",
    content: "Sounds good! I'll prep the backlog grooming doc.",
    status: MessageStatus.read,
    senderId: "user-2",
    chatKey: "ws-1:general",
    readBy: ["user-1", "user-3"],
    readAt: "2024-02-10T09:10:00.000Z",
    prevMessageId: "msg-1",
    createdAt: "2024-02-10T09:07:00.000Z",
    updatedAt: "2024-02-10T09:07:00.000Z",
  },
  {
    id: "msg-3",
    content: "Here's the updated mockup for the dashboard redesign.",
    status: MessageStatus.read,
    senderId: "user-4",
    chatKey: "ws-1:general",
    readBy: ["user-1", "user-2"],
    readAt: "2024-02-11T13:22:00.000Z",
    attachment: [
      {
        url: "https://picsum.photos/seed/dashboard/640/400",
        type: MessageAttachmentType.image,
        name: "dashboard-redesign.png",
      },
    ],
    createdAt: "2024-02-11T13:15:00.000Z",
    updatedAt: "2024-02-11T13:15:00.000Z",
  },
  {
    id: "msg-4",
    content: "This message was removed.",
    status: MessageStatus.read,
    senderId: "user-3",
    chatKey: "ws-1:general",
    isDeleted: true,
    createdAt: "2024-02-11T14:00:00.000Z",
    updatedAt: "2024-02-11T14:05:00.000Z",
  },
  {
    id: "msg-5",
    content: "@Alex Morgan can you review the API contract before EOD?",
    status: MessageStatus.read,
    senderId: "user-2",
    chatKey: "ws-1:general",
    readBy: ["user-1"],
    readAt: "2024-02-12T10:30:00.000Z",
    mentions: ["user-1"],
    createdAt: "2024-02-12T10:00:00.000Z",
    updatedAt: "2024-02-12T10:00:00.000Z",
  },
  {
    id: "msg-6",
    content: "Yep, reviewing it now — looks solid overall.",
    status: MessageStatus.read,
    senderId: "user-1",
    chatKey: "ws-1:general",
    readBy: ["user-2", "user-3"],
    readAt: "2024-02-12T11:00:00.000Z",
    isEdited: true,
    prevMessageId: "msg-5",
    createdAt: "2024-02-12T10:45:00.000Z",
    updatedAt: "2024-02-12T10:50:00.000Z",
  },
  {
    id: "msg-7",
    content: "Deploy for release 2.4 is scheduled for Friday 5pm.",
    status: MessageStatus.delivered,
    senderId: "user-1",
    chatKey: "ws-1:general",
    readBy: [],
    createdAt: "2024-02-13T08:00:00.000Z",
    updatedAt: "2024-02-13T08:00:00.000Z",
    reactions: ["✅"],
  },
  {
    id: "msg-8",
    content: "Sharing the QA checklist and the release notes together.",
    status: MessageStatus.delivered,
    senderId: "user-3",
    chatKey: "ws-1:general",
    readBy: [],
    attachment: [
      {
        url: "https://picsum.photos/seed/qa-checklist/640/420",
        type: MessageAttachmentType.image,
        name: "qa-checklist.png",
      },
      {
        url: "https://example.com/files/release-notes-2.4.pdf",
        type: MessageAttachmentType.document,
        name: "release-notes-2.4.pdf",
      },
    ],
    createdAt: "2024-02-14T15:20:00.000Z",
    updatedAt: "2024-02-14T15:20:00.000Z",
  },
  {
    id: "msg-9",
    content: "Noted, thanks Daniel! Will go through it before the deploy.",
    status: MessageStatus.unread,
    senderId: "user-1",
    chatKey: "ws-1:general",
    readBy: [],
    prevMessageId: "msg-8",
    createdAt: "2024-02-14T15:32:00.000Z",
    updatedAt: "2024-02-14T15:32:00.000Z",
  },

  // chat-3 (DM: Alex <-> Priya)
  {
    id: "msg-10",
    content: "Hey! Do you have 15 minutes today for a quick sync?",
    status: MessageStatus.read,
    senderId: "user-2",
    chatKey: "ws-1:user-1:user-2",
    readBy: ["user-1"],
    readAt: "2024-02-13T09:01:00.000Z",
    createdAt: "2024-02-13T09:00:00.000Z",
    updatedAt: "2024-02-13T09:00:00.000Z",
  },
  {
    id: "msg-11",
    content: "Sure, how about 3pm?",
    status: MessageStatus.read,
    senderId: "user-1",
    chatKey: "ws-1:user-1:user-2",
    readBy: ["user-2"],
    readAt: "2024-02-13T09:03:00.000Z",
    prevMessageId: "msg-10",
    createdAt: "2024-02-13T09:02:00.000Z",
    updatedAt: "2024-02-13T09:02:00.000Z",
  },
  {
    id: "msg-12",
    content: "Perfect, sending you a calendar invite now.",
    status: MessageStatus.delivered,
    senderId: "user-2",
    chatKey: "ws-1:user-1:user-2",
    readBy: [],
    createdAt: "2024-02-13T09:05:00.000Z",
    updatedAt: "2024-02-13T09:05:00.000Z",
    reactions: ["👍"],
  },
];

export const getMessagesForChat = (chatKey: string): Message[] =>
  mockMessages
    .filter((message) => message.chatKey === chatKey)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export const getMessageById = (id: string | undefined): Message | undefined =>
  id ? mockMessages.find((message) => message.id === id) : undefined;
