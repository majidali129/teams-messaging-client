import { FileIcon, PencilIcon, PencilLineIcon, ShareIcon, TrashIcon } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { MessageAttachmentType, MessageStatus, MessageType as MessageTypeEnum, type DeleteMessageInput, type Message as MessageType } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";
import { ContextMenu, ContextMenuSeparator, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useState } from "react";
import { EditMessageDialog } from "./edit-message-dialog";
import { DeleteMessageDialog } from "./delete-message-dialog";
import type { MessageEditedPayload } from "@/sockets/types";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

interface MessageBubbleProps {
  message: MessageType;
  editMessage: (input: MessageEditedPayload) => void;
  deleteMessage: (input: DeleteMessageInput) => void;
}

export const MessageBubble = ({ message, editMessage, deleteMessage }: MessageBubbleProps) => {
  const { user } = useUser()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const sender = message.sender;
  const isOwn = sender.id === user?.id;
  const replyTo = message.prevMessage;
  const replySender = replyTo ? replyTo.sender : undefined;
  const addedUsers = message.addedUsers;

  const isSystemMessage = message.type === MessageTypeEnum.system;
  const systemMessageContent = isSystemMessage ?  `added ${addedUsers?.map(user => user.name).join(', ')} to the chat` : message.content;

  if(isSystemMessage) return (
    <Message  className="group">
            <MessageContent >
              <BubbleGroup className="self-center">
                <Bubble className="max-w-full opacity-90" variant="secondary">
                  <BubbleContent className="py-1 border-none outline-0 ring-0">
                    {systemMessageContent && <p className="whitespace-pre-wrap">
                      <span className="font-medium">{sender.name}</span> {" "}
                      {systemMessageContent}</p>}
                  </BubbleContent>
                </Bubble>
              </BubbleGroup>

              <MessageFooter className="gap-1">
                <span>{formatTime(message.createdAt)}</span>
              </MessageFooter>
            </MessageContent>
          </Message>

  )

  return (
          <Message align={isOwn ? "end" : "start"} className="group">
            <ContextMenu disabled={message.isDeleted}>
              <ContextMenuTrigger className="flex items-center gap-2">
                <MessageContent >
                  <MessageHeader>{isOwn ? "You" : sender.name}</MessageHeader>

                  <BubbleGroup>
                    {replyTo && !message.isDeleted && (
                      <div
                        className={`w-fit max-w-[80%] rounded border-l-2 border-primary/50 bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground ${isOwn ? "self-end" : "self-start"
                          }`}
                      >
                        <p className="font-medium text-foreground/80">{replySender?.name}</p>
                        <p className="truncate">
                          {replyTo.isDeleted ? "This message was removed" : replyTo.content}
                        </p>
                      </div>
                    )}

                    <Bubble className="w-auto max-w-full" align={isOwn ? "end" : "start"} variant={isOwn ? "default" : "secondary"}>
                      <BubbleContent>
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
              </ContextMenuTrigger>
              <ContextMenuContent side={isOwn ? "left" : "right"} align="start">
                <ContextMenuGroup>
                  {isOwn && !message.isDeleted && <ContextMenuItem onClick={() => setOpenEditDialog(true)}>
                    <PencilIcon />
                    Edit
                  </ContextMenuItem>}
                  <ContextMenuItem>
                    <ShareIcon />
                    Forward
                  </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem variant="destructive" onClick={() => setOpenDeleteDialog(true)}>
                    <TrashIcon />
                    Delete
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>

            <EditMessageDialog message={message} open={openEditDialog} setOpen={setOpenEditDialog} editMessage={editMessage} />
            <DeleteMessageDialog message={message} open={openDeleteDialog} setOpen={setOpenDeleteDialog} deleteMessage={deleteMessage} />
          </Message>
  );
};
