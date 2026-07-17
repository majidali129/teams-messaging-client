import { Fragment, useLayoutEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageGroup } from "@/components/ui/message";
import { Empty } from "@/components/shared/empty";
import { MessageBubble } from "./message-bubble";
import { useChatMessages } from "../hooks/use-chat-messages";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import type { DeleteMessageInput, ReadMessageInput } from "@/types";
import type { MessageEditedPayload } from "@/sockets/types";

const formatDayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

interface ChatMessagesProps {
  chatKey: string;
  editMessage: (input: MessageEditedPayload) => void;
  deleteMessage: (input: DeleteMessageInput) => void;
  emitReadMessage: (input: ReadMessageInput) => void;
}

export const ChatMessages = ({ chatKey, editMessage, deleteMessage, emitReadMessage }: ChatMessagesProps) => {
  const { messages, isLoading, error } = useChatMessages(chatKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageKey = messages.at(-1)?.clientMsgId ?? messages.at(-1)?.id;

  // scroll to end message
  useLayoutEffect(() => {
    if (messages && messages.length > 0 && !isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [lastMessageKey, isLoading, chatKey])


  const renderLoader = () => isLoading ? <LoadingState title="Loading messages" description="Please wait while we load the messages" /> : null;
  const renderError = () => !isLoading && error ? <ErrorState title="Failed to load messages" description="Please try again later" /> : null;

  const renderEmpty = () => !isLoading && !error && messages.length === 0 ? <Empty title="No messages yet" description="Say hello to get the conversation started." /> : null;


  const messagesWithDividers = messages.map((message, index) => {
    const day = new Date(message.createdAt).toDateString();
    const previousDay =
      index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
    return { message, showDivider: day !== previousDay };
  });


  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      {renderLoader()}
      {renderError()}
      {renderEmpty()}
      <MessageGroup className="p-4">
        {messagesWithDividers.map(({ message, showDivider }) => {
          return (
            <Fragment key={message.clientMsgId || message.id}>
              {showDivider && (
                <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  {formatDayLabel(message.createdAt)}
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              <MessageBubble message={message} editMessage={editMessage} deleteMessage={deleteMessage} emitReadMessage={emitReadMessage} />
            </Fragment>
          );
        })}
      </MessageGroup>
      <div ref={messagesEndRef} className="h-1" aria-hidden="true" />
    </ScrollArea>
  );
};
