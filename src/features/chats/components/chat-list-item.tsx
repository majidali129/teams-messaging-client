import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getAvatar, getInitials } from "@/lib/utils";
import type { Chat, User } from "@/types";
import { useCurrentUser } from "@/features/auth/context/current-user-context";
import { useQueryClient } from "@tanstack/react-query";
import { chatsApi } from "@/api/services/chats";
import { queryKeys } from "@/query-keys";

const previewForMessage = (chat: Chat, user: User) => {
  const message = chat.lastMessage;
  if (!message) return "No messages yet";
  const sender = message.sender;
  const senderLabel =
    message.sender.id === user.id ? "You" : sender.name.split(" ")[0];
  const body =
    message.content ||
    (message.attachments?.length ? "Sent an attachment" : "");

  return chat.isChannel ? `${senderLabel}: ${body}` : body;
};

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatListItem = ({
  chat,
  isActive,
  onSelect,
}: ChatListItemProps) => {
  const queryClient = useQueryClient()
  const user = useCurrentUser();
  const otherUser = chat.isChannel
    ? undefined
    : chat.participants.find((p) => p.id !== user.id);
  const displayName = chat.isChannel
    ? (chat.name ?? "Channel")
    : (otherUser?.name ?? "Direct message");

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryFn: () => chatsApi.getMessages(chat.chatKey),
      queryKey: queryKeys.chats.messages(chat.chatKey),
      staleTime: 50000
    })
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
      )}
      onMouseEnter={handleMouseEnter}
    >
      {chat.isChannel ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Avatar>
            <AvatarImage src={getAvatar(displayName)} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Avatar>
          <AvatarImage src={getAvatar(displayName)} alt={displayName} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          <AvatarBadge className="bg-green-500" />
        </Avatar>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{displayName}</span>
          {chat.isChannel && (
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              channel
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {previewForMessage(chat, user)}
        </p>
      </div>
    </button>
  );
};
