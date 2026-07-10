import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty } from "@/components/shared/empty";
import { MessagesSquareIcon } from "lucide-react";
import type { Chat } from "@/types";
import { ChatListItem } from "./chat-list-item";
import { CreateChatDialog } from "./create-chat-dialog";
import { useWorkspace } from "@/features/workspaces/hooks/use-workspace";

interface ChatListProps {
  chats: Chat[];
  selectedChatKey: string | undefined;
  onSelectChat: (chatKey: string) => void;
}

export const ChatList = ({ chats, selectedChatKey, onSelectChat }: ChatListProps) => {
  const {workspace} = useWorkspace()
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b p-3">
        <h2 className="text-sm font-semibold">Chats</h2>
        <CreateChatDialog
          workspace={workspace!}
          trigger={
            <Button size="sm" variant="outline">
              <PlusIcon />
              New group
            </Button>
          }
        />
      </div>

      {chats.length === 0 ? (
        <Empty
          icon={<MessagesSquareIcon />}
          title="No chats yet"
          description="Create a group chat to start collaborating."
        />
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-0.5 p-2">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.chatKey}
                chat={chat}
                isActive={chat.chatKey === selectedChatKey}
                onSelect={() => onSelectChat(chat.chatKey)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
