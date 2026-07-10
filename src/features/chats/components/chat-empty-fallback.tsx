import { MessageCircleIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";

export const ChatEmptyFallback = () => {
  return (
    <div className="hidden h-full items-center justify-center md:flex">
      <Empty
        icon={<MessageCircleIcon />}
        title="Select a chat"
        description="Choose a chat from the list to start messaging, or create a new group chat."
      />
    </div>
  );
};
