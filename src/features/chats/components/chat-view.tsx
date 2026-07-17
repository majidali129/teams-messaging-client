import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatComposer } from "./chat-composer";
import { useChat } from "../hooks/use-chat";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Empty } from "@/components/shared/empty";
import { MessagesSquareIcon } from "lucide-react";
import { useChatSocket } from "../../../sockets/use-chat-socket";

interface ChatViewProps {
  chatKey: string;
  onBack?: () => void;
}

export const ChatView = ({ chatKey, onBack }: ChatViewProps) => {
  const { chat, isLoading: isLoadingChat, error: errorChat } = useChat(chatKey);
  const {sendMessage, typingUsers, editMessage, deleteMessage, emitReadMessage} = useChatSocket(chatKey)

  const renderLoader = () => isLoadingChat ? <LoadingState title="Loading chat" description="Please wait while we load the chat" /> : null;
  const renderError = () => !isLoadingChat && errorChat ? <ErrorState title="Failed to load chat" description="Please try again later" /> : null;
  const renderChat = () => !isLoadingChat && !errorChat && chat ? (
    <>
      <ChatHeader chat={chat} onBack={onBack} />
      <ChatMessages chatKey={chat.chatKey} editMessage={editMessage} deleteMessage={deleteMessage} emitReadMessage={emitReadMessage} />
      <ChatComposer chatKey={chatKey} sendMessage={sendMessage} typingUsers={typingUsers} />
    </>
  ) : <Empty icon={<MessagesSquareIcon />} title="No chat selected" description="Select a chat to start chatting." />;

 
  return (
    <div className="flex h-full flex-col overflow-y-auto transition-all duration-500 ease-in-out">
      {renderLoader()}
      {renderError()}
      {renderChat()}
    </div>
  );
};
