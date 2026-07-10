import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatar, getInitials } from "@/lib/utils";
import { getUserById } from "@/lib/mock-data";
import type { Chat } from "@/types";

interface ChatDetailsSheetProps {
  chat: Chat;
  displayName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatDetailsSheet = ({ chat, displayName, open, onOpenChange }: ChatDetailsSheetProps) => {
  const participants = chat.participants
    .map((participant) => participant)
    .filter((user): user is NonNullable<typeof user> => Boolean(user));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{displayName}</SheetTitle>
          <SheetDescription>
            {chat.isChannel ? "Group chat" : "Direct message"} · {participants.length}{" "}
            participant{participants.length === 1 ? "" : "s"}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-1 overflow-y-auto px-4 pb-4">
          {participants.map((user) => (
            <div key={user.id} className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-accent">
              <Avatar size="lg">
                <AvatarImage src={getAvatar(user.name)} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
