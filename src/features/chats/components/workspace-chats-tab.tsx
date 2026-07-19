
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatView } from "./chat-view";
import { ChatEmptyFallback } from "./chat-empty-fallback";
import { useWorkspaceChats } from "@/features/workspaces/hooks/use-workspace-chats";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state"; 
import { useSearchParams } from "react-router";

export const WorkspaceChatsTab = () => {
  const { chats, isLoading, error } = useWorkspaceChats()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedChatKey = searchParams.get('chat')
  const setSelectedChatKey = (chatKey: string) => {
    searchParams.set('chat', chatKey)
    setSearchParams(searchParams)
  }


  const renderLoader = () => isLoading ? <LoadingState className="h-full" /> : null;
  const renderError = () => !isLoading && error && <ErrorState title="Failed to load chats" description="Please try again later" />;
  return (
    <div className="flex h-full">
      {renderLoader()}
      {renderError()}
      <ChatList
        chats={chats}
        selectedChatKey={selectedChatKey ?? ''}
        onSelectChat={setSelectedChatKey}
      />



      <div className={cn("min-w-0 flex-1 md:block", selectedChatKey ? "block" : "hidden")}>
        {selectedChatKey ? (
          <ChatView chatKey={selectedChatKey} onBack={() => setSelectedChatKey('')} />
        ) : (
          <ChatEmptyFallback />
        )}
      </div>
    </div>
  );
};
