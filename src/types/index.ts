import type {
  WorkspaceRole,
  WorkspaceStatus,
  InviteStatus,
  MessageStatus,
  MessageAttachmentType,
} from "./enums";

export * from "./enums";


export interface UserAvatar {
  url: string;
  publicId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
  user: User;
}

export interface Workspace {
  id: string;
  name: string;
  status: WorkspaceStatus;
  createdAt: Date;
  updatedAt: Date;
  chatCount: number;
  owner?: User;
  members: WorkspaceMember[];
  invites: Invite[];
  invitesCount: number;
}

export interface Invite {
  id: string;
  workspaceId: {
    id: string;
    name: string;
  }
  email: string;
  role: WorkspaceRole;
  status: InviteStatus;
  invitedBy: User;
  expiresAt: Date;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  chatKey: string;
  workspaceId: string;
  name?: string;
  isChannel: boolean;
  lastMessageId?: {
    _id: string;
    content: string;
    createdAt: string;
    senderId: User;
    attachments?: MessageAttachment[];
  }
  participants: User[];
  createdAt: string;
  updatedAt: string;
}


export interface MessageAttachment {
  url: string;
  type: MessageAttachmentType;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  status: MessageStatus;
  senderId: {
    _id: string;
    name: string;
    email: string;
  }
  chatKey: string;
  readBy?: string[];
  readAt?: string | null;
  attachment?: MessageAttachment[];
  prevMessageId?: {
    _id: string;
    content: string;
    createdAt: string;
    isDeleted: boolean;
    isEdited: boolean;
    readAt: Date;
    readBy?: User[],
    senderId: User;
  }
  isDeleted?: boolean;
  isEdited?: boolean;
  reactions?: string[];
  mentions?: string[];
  createdAt: string;
  updatedAt: string;
}


export interface ChatWithParticipants extends Chat {
  participantUsers?: User[];
  lastMessage?: Message;
}

export interface MessageWithSender extends Message {
  sender?: User;
  replyTo?: Message;
}

export interface InviteWithRelations extends Invite {
  workspace?: Workspace;
  inviter?: User;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}


export interface CreateWorkspaceInput {
  name: string;
}

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput>;

export interface CreateInviteInput {
  email: string;
  role: WorkspaceRole;
}

export interface AcceptInviteInput {
  workspaceId?: string;
  token?: string;
  status: 'accepted' | 'declined';
}

export interface CreateChatInput {
  workspaceId: string;
  isChannel?: boolean;
  name?: string;
  participants?: string[];
}

export interface AddParticipantsInput {
  participants: string[];
}

export interface SendMessageInput {
  chatKey: string;
  content: string;
  mentions?: string[];
  attachments?: MessageAttachment[]
}


export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  code: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
