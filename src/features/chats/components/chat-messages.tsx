import { Fragment } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageGroup } from "@/components/ui/message";
import { Empty } from "@/components/shared/empty";
import { MessageBubble } from "./message-bubble";
import { useChatMessages } from "../hooks/use-chat-messages";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";

const formatDayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

export const ChatMessages = ({ chatKey }: { chatKey: string }) => {
  const {messages, isLoading, error} = useChatMessages(chatKey);

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
    <ScrollArea className="flex-1">
      {renderLoader()}
      {renderError()}
      {renderEmpty()}
      <MessageGroup className="p-4">
        {messagesWithDividers.map(({ message, showDivider }) => {
          return (
            <Fragment key={message.id}>
              {showDivider && (
                <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  {formatDayLabel(message.createdAt)}
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              <MessageBubble message={message} />
            </Fragment>
          );
        })}
      </MessageGroup>
    </ScrollArea>
  );
};
