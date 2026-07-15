import type {
  WorkspaceRole,
  WorkspaceStatus,
  InviteStatus,
  MessageStatus,
  MessageAttachmentType,
  MessageType,
} from "./enums";

export * from "./enums";


export interface UserAvatar {
  url: string;
  publicId: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export type SignInResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface VerifyEmailInput {
  code: string;
}

export interface SignInInput {
  email: string;
  password: string;
}


export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Workspaces =======================
export interface CreateWorkspaceInput {
  name: string;
}

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput>;


export interface WorkspaceMember {
  role: WorkspaceRole;
  joinedAt: Date;
  user: User;
}

export type Workspace = {
  id: string;
  name: string;
  status: WorkspaceStatus;
  owner: User;
  membersCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export type Workspaces = {
  workspaces: Workspace[];
  totalCount: number;
}

export type WorkspaceDetails = {
  id: string;
  name: string;
  roomKey: string;
  status: WorkspaceStatus;
  userRole: WorkspaceRole;
  owner: User;
  membersCount: number;
  chatsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceMembers = {
  members: WorkspaceMember[];
  totalCount: number;
}

// Invites =======================

export interface CreateInviteInput {
  email: string;
  role: WorkspaceRole;
  roomKey: string;
}

export interface AcceptInviteInput {
  workspaceId?: string;
  token?: string;
  status: 'accepted' | 'declined';
}

export interface Invite {
  id: string;
  email: string;
  role: WorkspaceRole;
  status: InviteStatus;
  invitedBy: User;
  expiresAt: Date;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Invites = {
  invites: Invite[];
  totalCount: number;
}


// Chats =======================

export interface CreateChatInput {
  workspaceId: string;
  isChannel?: boolean;
  name?: string;
  participants?: string[];
}

export interface AddParticipantsInput {
  participants: string[];
}

type MessagePreview = {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  attachments?: MessageAttachment[];
}

export type Chat = {
  id: string;
  chatKey: string;
  workspaceId: string;
  name?: string;
  isChannel: boolean;
  lastMessage?: MessagePreview;
  participants: User[];
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}


export type Chats = {
  chats: Chat[];
  totalCount: number;
}

// Messages ======================

export interface MessageAttachment {
  url: string;
  type: MessageAttachmentType;
  name: string;
}

export interface SendMessageInput {
  chatKey: string;
  content: string;
  mentions?: string[];
  attachments?: MessageAttachment[]
}

export interface EditMessageInput extends SendMessageInput {
  messageId: string;
}

export interface DeleteMessageInput {
  messageId: string;
  chatKey: string;
}

export type Message = {
  id: string;
  content: string;
  type: MessageType;
  sender: User;
  attachments?: MessageAttachment[];
  readBy?: User[];
  readAt?: string | null;
  isDeleted?: boolean;
  isEdited?: boolean;
  status: MessageStatus;
  chatKey: string;
  reactions?: string[];
  mentions?: Pick<User, 'id' | 'name'>[];
  addedUsers?: User[];
  prevMessage?: MessagePreview & {
    isDeleted: boolean;
    sender: User;
  };
  createdAt: string;
  updatedAt: string;
}

export type Messages = Message[]


