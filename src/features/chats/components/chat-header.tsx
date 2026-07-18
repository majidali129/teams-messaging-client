import { useState } from "react";
import { ArrowLeftIcon, HashIcon, InfoIcon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAvatar, getInitials } from "@/lib/utils";
import type { Chat } from "@/types";
import { ChatDetailsSheet } from "./chat-details-sheet";
import { useCurrentUser } from "@/features/auth/context/current-user-context";
import { AddParticipantsToChannelDialog } from "./add-participants-to-channel-dialog";

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void;
}

export const ChatHeader = ({ chat, onBack }: ChatHeaderProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const user = useCurrentUser();
  const displayName = chat.isChannel? chat.name: chat.participants.find(p => p.id !== user.id)?.name

  return (
    <div className="flex items-center gap-2 border-b p-3">
      {onBack && (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeftIcon />
        </Button>
      )}

      {chat.isChannel ? (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <HashIcon className="size-4 text-muted-foreground" />
        </div>
      ) : (
        <Avatar size="lg">
          <AvatarImage src={getAvatar(displayName!)} alt={displayName!} />
          <AvatarFallback>{getInitials(displayName!)}</AvatarFallback>
        </Avatar>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold">{displayName!}</span>
          {chat.isChannel && (
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              channel
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {chat.participants.length} participant{chat.participants.length === 1 ? "" : "s"}
        </p>
      </div>

<div className="flex items-center gap-2">
{chat.isChannel && <AddParticipantsToChannelDialog
          chat={chat}
          trigger={
            <Button size="sm" variant="outline">
              <UsersIcon />
              Add participants
            </Button>
          }
        />}
      <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(true)} aria-label="Chat details">
        <InfoIcon />
      </Button>
</div>

      <ChatDetailsSheet
        chat={chat}
        displayName={displayName!}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};
