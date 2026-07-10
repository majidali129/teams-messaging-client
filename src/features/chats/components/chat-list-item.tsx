
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getAvatar, getInitials } from "@/lib/utils";
import type { Chat, User } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";

const previewForMessage = (chat: Chat, user: User) => {
  const message = chat.lastMessageId;
  if (!message) return "No messages yet";
  const sender = message.senderId;
  const senderLabel = message.senderId.id === user.id ? "You" : sender?.name.split(" ")[0];
  const body = message.content || (message.attachments?.length ? "Sent an attachment" : "");

  return chat.isChannel ? `${senderLabel}: ${body}` : body;
};

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatListItem = ({ chat, isActive, onSelect }: ChatListItemProps) => {
  const { user } = useUser();
const otherUser = !chat.isChannel
? chat.participants.find(p => p.id !== user!.id)
: undefined;

const displayName = chat.isChannel
? (chat.name ?? "Channel")
: (otherUser?.name! ?? "Direct message");


  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
      )}
    >
      {chat.isChannel ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
         <Avatar>
          <AvatarImage src={getAvatar(chat.name!)} alt={chat.name!} />
          <AvatarFallback>{getInitials(chat.name!)}</AvatarFallback>
        </Avatar>
        </div>
      ) : (
        <Avatar>
          <AvatarImage src={getAvatar(otherUser!.name)} alt={otherUser!.name} />
          <AvatarFallback>{getInitials(otherUser!.name)}</AvatarFallback>
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
        <p className="truncate text-xs text-muted-foreground">{previewForMessage(chat, user! as User)}</p>
      </div>
    </button>
  );
};
