import { useRef, useState, type ChangeEvent } from "react";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { socketInstance } from "@/sockets/instance";
import { EVENTS, type SendMessagePayload } from "@/sockets/types";
import { useUser } from "@/features/auth/hooks/use-user";
import { ChatFileUploader } from "./chat-file-uploader";
import { ChatFilePreview } from "./chat-file-preview";
import { useGetUploadSignature } from "../hooks/use-get-upload-signature";
import { useUploadFile } from "../hooks/use-upload-file";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/query-keys";
import { MessageAttachmentType, MessageStatus, MessageType, type Message, type MessageAttachment } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import type { MessagesChache } from "@/sockets/use-chat-socket";
import { toast } from "sonner";


interface ChatComposerProps {
  chatKey: string;
  sendMessage: (input: SendMessagePayload) => void;
  typingUsers: Map<string, string>
}

export const ChatComposer = ({ chatKey, sendMessage, typingUsers }: ChatComposerProps) => {
  const { user } = useUser();
  const [content, setContent] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false)
  const { signatureData, gettingSignature } = useGetUploadSignature(file)
  const { uploadFile, uploadingFile } = useUploadFile()
  const socket = socketInstance()
  const names = [...typingUsers.values()]
  const hasContent = content.trim().length > 0;
  const hasFile = file !== null;


  const emitStart = () => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;
    socket.emit(EVENTS.TYPING_UPDATE, {
      chatKey,
      userId: user?.id,
      name: user?.name,
      isTyping: true
    })
  }


  const emitStop = () => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    socket.emit(EVENTS.TYPING_UPDATE, {
      chatKey,
      userId: user?.id,
      name: user?.name,
      isTyping: false
    })
  }

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    emitStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStop();
    }, 1500);
  }

  const onFileChange = (file: File | null) => {
    if (!file) return;
    try {
      getAttachmentType(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "This file type is not supported");
      return;
    }
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  }

  const onFileRemove = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setUploaderKey(prev => prev + 1);
    setFile(null);
  }

  const getAttachmentType = (selectedFile: File): MessageAttachmentType => {
    if (selectedFile.type.startsWith("image/")) return MessageAttachmentType.image;
    if (selectedFile.type.startsWith("video/")) return MessageAttachmentType.video;
    if (selectedFile.type.startsWith("audio/")) return MessageAttachmentType.audio;
    if (selectedFile.type === "application/pdf") return MessageAttachmentType.pdf;
    throw new Error("This file type is not supported");
  }

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || uploadingFile || (file && !signatureData)) return;

    const text = content.trim();
    const selectedFile = file;
    const previewUrl = filePreview;
    const clientMsgId = uuidv4();
    const createdAt = new Date().toISOString();

    const optimisticMessage: Message = {
      id: clientMsgId,
      clientMsgId,
      content: text,
      type: MessageType.user,
      sender: user,
      attachments: selectedFile && previewUrl
      ? [{
          url: previewUrl,
          publicId: "",
          resourceType: getAttachmentType(selectedFile),
          name: selectedFile.name,
        }]
      : [],
      status: MessageStatus.pending,
      chatKey,
      mentions: [],
      createdAt,
      updatedAt: createdAt
    };

    queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
      if (!old) return { messages: [optimisticMessage], total: 1 };
      return {
        messages: [...old.messages, optimisticMessage],
        total: old.total + 1
      };
    });

    emitStop();
    setContent('');
    setFile(null);
    setFilePreview(null);
    setUploaderKey(prev => prev + 1);

    try {
      let attachments: MessageAttachment[] = [];

      if (selectedFile && signatureData) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('api_key', signatureData.api_key);
        formData.append('resource_type', 'auto');
        formData.append('folder', signatureData.folderName);
        formData.append('invalidate', 'true');

        const uploaded = await uploadFile({
          url: signatureData.uploadUrl,
          formData,
        });

        if (!("secure_url" in uploaded)) {
          throw new Error("The file upload failed");
        }

        attachments = [{
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          resourceType: getAttachmentType(selectedFile),
          name: selectedFile.name,
        }];
      }

      sendMessage({
        clientMsgId,
        chatKey,
        content: text,
        attachments,
        mentions: []
      });
    } catch (error) {
      queryClient.setQueryData<MessagesChache>(queryKeys.chats.messages(chatKey), (old) => {
        if (!old) return old;
        return {
          messages: old.messages.filter(message => message.clientMsgId !== clientMsgId),
          total: Math.max(0, old.total - 1),
        };
      });
      setContent(text);
      setFile(selectedFile);
      setFilePreview(previewUrl);
      toast.error(error instanceof Error ? error.message : "Could not send the message");
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }


  return (
    <form className="border-t py-3 pr-3" onSubmit={onSubmit} ref={formRef}>
      {names.length > 0 && (
        <p className="px-4 text-xs text-muted-foreground">
          {names.length === 1
            ? `${names[0]} is typing…`
            : `${names.join(", ")} are typing…`}
        </p>
      )}
      <div className="flex justify-between rounded border bg-card p-2">
        <div className="flex items-start flex-1 flex-col gap-2">

          <Textarea
          onKeyDown={onKeyDown}
            value={content}
            placeholder="Write a message…"
            onChange={onChange}
            rows={1}
            className="min-h-9 flex-1 resize-none border-none focus-within:bg-accent  px-1  shadow-none focus-visible:ring-0"
          />
          {filePreview && (
            <ChatFilePreview
              preview={filePreview}
              onFileRemove={onFileRemove}
              uploading={uploadingFile}
            />
          )}
        </div>



        <div className="flex items-end  gap-2">
          <ChatFileUploader onFileChange={onFileChange} key={uploaderKey} file={file} />
            <Button
              type="submit"
              size="icon-sm"
              disabled={uploadingFile || gettingSignature || (!hasContent && !hasFile)}
            >
              <SendIcon />
            </Button>
        </div>
      </div>
    </form>
  );
};
