import { Check, CheckCheck, Clock, FileIcon, PencilIcon, PlayIcon, ShareIcon, TrashIcon, UserIcon } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { MessageAttachmentType, MessageStatus, MessageType as MessageTypeEnum, type DeleteMessageInput, type Message as MessageType, type MessageAttachment, type ReadMessageInput, type User } from "@/types";
import { useCurrentUser } from "@/features/auth/context/current-user-context";
import { ContextMenu, ContextMenuSeparator, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { EditMessageDialog } from "./edit-message-dialog";
import { DeleteMessageDialog } from "./delete-message-dialog";
import { AttachmentPreviewDialog } from "./attachment-preview-dialog";
import type { MessageEditedPayload } from "@/sockets/types";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "@/components/ui/popover";
import { Empty } from "@/components/shared/empty";
import { useInView } from "react-intersection-observer";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

interface MessageBubbleProps {
  message: MessageType;
  editMessage: (input: MessageEditedPayload) => void;
  deleteMessage: (input: DeleteMessageInput) => void;
  emitReadMessage: (input: ReadMessageInput) => void;
}

export const MessageBubble = ({ message, editMessage, deleteMessage, emitReadMessage }: MessageBubbleProps) => {
  const user = useCurrentUser()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [showUsersReadMessage, setShowUsersReadMessage] = useState(false)
  const [previewAttachment, setPreviewAttachment] = useState<MessageAttachment | null>(null)
  const { ref: viewRef, inView } = useInView()
  const sender = message.sender;
  const isOwn = sender.id === user.id;
  const replyTo = message.prevMessage;
  const replySender = replyTo ? replyTo.sender : undefined;
  const addedUsers = message.addedUsers;
  const readBy = message.readBy ?? [];
    const isRead = readBy.length > 0 && message.status === MessageStatus.read;

  const isSystemMessage = message.type === MessageTypeEnum.system;
  const systemMessageContent = isSystemMessage ? `added ${addedUsers?.map(user => user.name).join(', ')} to the chat` : message.content;

  if (isSystemMessage) return (
    <Message className="group">
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

  const renderStatusIcon = () => {
    if (isRead && isOwn) {
      return <CheckCheck className="size-5" />
    } else if (isOwn && message.status === MessageStatus.delivered) {
      return <Check className="size-5" />
    } else if (isOwn && message.status === MessageStatus.pending) {
      return <Clock className="size-5" />
    }
    return null;
  }

  const isAlreadyRead = readBy.some((reader) => reader.id === user.id);
  useEffect(() => {
    if (inView && !isAlreadyRead && message.status === MessageStatus.delivered && !isOwn) {  
      emitReadMessage({ messageId: message.id, chatKey: message.chatKey });
    }
  }, [inView, isAlreadyRead, isOwn]);

  return (
    <Popover>
      <Message align={isOwn ? "end" : "start"} className="group">
        <ContextMenu disabled={message.isDeleted}>
          <ContextMenuTrigger className="flex items-center gap-2">
            <MessageContent >
              <MessageHeader className="flex items-center gap-2">
                {message.isEdited && !message.isDeleted && (
                  <span className="flex items-center gap-0.5">
                    Edited
                  </span>
                )}
              </MessageHeader>

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
                  <BubbleContent className={`relative ${message.isDeleted ? "" : "min-h-13"} min-w-30`}>
                    {message.isDeleted ? (
                      <span className="italic opacity-70">This message was removed</span>
                    ) : (
                      <div>
                        <div className="space-y-2">

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex flex-col gap-2">
                              {message.attachments.map((attachment, index) => (
                                attachment.resourceType === MessageAttachmentType.image ? (
                                  <button
                                    key={`${attachment.url}-${index}`}
                                    type="button"
                                    onClick={() => setPreviewAttachment(attachment)}
                                    className="block max-w-64 cursor-pointer overflow-hidden rounded-lg"
                                  >
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="block w-full transition-opacity hover:opacity-90"
                                    />
                                  </button>
                                ) : attachment.resourceType === MessageAttachmentType.video ? (
                                  <button
                                    key={`${attachment.url}-${index}`}
                                    type="button"
                                    onClick={() => setPreviewAttachment(attachment)}
                                    className="group relative block max-w-64 cursor-pointer overflow-hidden rounded-lg"
                                  >
                                    <video src={attachment.url} muted playsInline className="block w-full" />
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                                      <span className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white">
                                        <PlayIcon className="size-5 fill-current" />
                                      </span>
                                    </span>
                                  </button>
                                ) : (
                                  <a
                                    key={`${attachment.url}-${index}`}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex max-w-64 items-center gap-2 rounded-lg border border-current/15 px-3 py-2"
                                  >
                                    <FileIcon className="size-4 shrink-0" />
                                    <span className="truncate">{attachment.name}</span>
                                  </a>
                                )
                              ))}
                            </div>
                          )}

                          {message.content && (
                            <p className="whitespace-pre-wrap text-left mr-16.5">
                              {message.content}
                            </p>
                          )}

                        </div>
                        {!message.isDeleted && <div className="flex items-center gap-2 justify-end min-w-16.5 absolute right-1 bottom-0.5" >
                          <span>{formatTime(message.createdAt)}</span>
                          <button onClick={() => setShowUsersReadMessage(!showUsersReadMessage)} className="cursor-pointer">
                            <PopoverTrigger render={<span className="cursor-pointer">{renderStatusIcon()}</span>} />
                          </button>


                        </div>}
                      </div>
                    )}
                  </BubbleContent>

                  {!message.isDeleted && !!message.reactions?.length && (
                    <BubbleReactions align={isOwn ? "end" : "start"}>
                      {message.reactions.join(" ")}
                    </BubbleReactions>
                  )}

                </Bubble>
                {
                  isOwn && (
                    <ShowUsersReadMessage users={readBy} isRead={isRead} />
                  )
                }
              </BubbleGroup>
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
        <AttachmentPreviewDialog attachment={previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)} />
      </Message>
      {/* for message read event */}
      <div ref={viewRef} />
    </Popover>
  );
};


function ShowUsersReadMessage({ users, isRead }: { users: User[], isRead: boolean }) {
  const renderNoreadersFallback = () => !isRead ? <Empty title="No one has read this message" description="This message has not been read by anyone" /> : null;
  return (
    <PopoverContent className="w-52" align="center" side="left">
      <PopoverHeader>
        <h3 className="text-lg font-medium">Read by</h3>
      </PopoverHeader>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {renderNoreadersFallback()}
        {isRead && users.length > 0 && users.map(user => (
          <div key={user.id} className="flex items-center gap-2 hover:bg-muted p-2 rounded">
            <UserIcon className="size-4" />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </PopoverContent>
  )
}