import { FileIcon, PencilLineIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { getAvatar, getInitials } from "@/lib/utils";
import { MessageAttachmentType, MessageStatus, type Message as MessageType } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export const MessageBubble = ({ message }: { message: MessageType }) => {
  const {user} = useUser()
  const sender = message.sender;
  const isOwn = sender.id === user?.id;
  const replyTo = message.prevMessage;
  const replySender = replyTo ? replyTo.sender : undefined;

  return (
    <Message align={isOwn ? "end" : "start"}>
      <MessageAvatar>
        <Avatar size="lg" className="size-8">
          <AvatarImage src={getAvatar(sender?.name)} alt={sender?.name} />
          <AvatarFallback>{getInitials(sender?.name)}</AvatarFallback>
        </Avatar>
      </MessageAvatar>

      <MessageContent>
        <MessageHeader>{isOwn ? "You" : sender.name}</MessageHeader>

        <BubbleGroup>
          {replyTo && !message.isDeleted && (
            <div
              className={`w-fit max-w-[80%] rounded-lg border-l-2 border-primary/50 bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground ${
                isOwn ? "self-end" : "self-start"
              }`}
            >
              <p className="font-medium text-foreground/80">{replySender?.name}</p>
              <p className="truncate">
                {replyTo.isDeleted ? "This message was removed" : replyTo.content}
              </p>
            </div>
          )}

          <Bubble className="w-auto max-w-full" align={isOwn ? "end" : "start"} variant={isOwn ? "default" : "secondary"}>
            <BubbleContent className="space-y-2">
              {message.isDeleted ? (
                <span className="italic opacity-70">This message was removed</span>
              ) : (
                <>
                  {message.attachments?.map((attachment, index) =>
                    attachment.type === MessageAttachmentType.image ? (
                      <img
                        key={index}
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-64 rounded-lg"
                      />
                    ) : (
                      <a
                        key={index}
                        href={attachment.url}
                        className="flex items-center gap-2 rounded-lg border border-current/15 bg-black/5 px-2.5 py-2 text-sm dark:bg-white/5"
                      >
                        <FileIcon className="size-4 shrink-0" />
                        <span className="truncate">{attachment.name}</span>
                      </a>
                    )
                  )}
                  {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                </>
              )}
            </BubbleContent>

            {!message.isDeleted && !!message.reactions?.length && (
              <BubbleReactions align={isOwn ? "end" : "start"}>
                {message.reactions.join(" ")}
              </BubbleReactions>
            )}
          </Bubble>
        </BubbleGroup>

        <MessageFooter className="gap-1">
          {message.isEdited && !message.isDeleted && (
            <span className="flex items-center gap-0.5">
              <PencilLineIcon className="size-3" />
              edited
            </span>
          )}
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && message.status === MessageStatus.read && (
            <span className="text-primary">Read</span>
          )}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
};
