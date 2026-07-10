import { useRef } from "react";
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useChatSocket } from "../../../sockets/use-chat-socket";
import { socketInstance } from "@/sockets/instance";
import { EVENTS } from "@/sockets/types";
import { useUser } from "@/features/auth/hooks/use-user";

const QUICK_EMOJIS = ["😀", "😂", "😍", "👍", "🙏", "🎉", "🔥", "👀", "✅", "❤️", "😢", "🤔"];

export const ChatComposer = ({chatKey}: {chatKey: string}) => {
  const { user } = useUser();
 const {sendMessage, typingUsers} =  useChatSocket(chatKey)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false)
  const socket = socketInstance()
  const names = [...typingUsers.values()]


  const emitStart = () => {
    if(isTypingRef.current) return;
    isTypingRef.current = true;
    socket.emit(EVENTS.TYPING_UPDATE, {
      chatKey,
      userId: user?.id,
      name: user?.name,
      isTyping: true
    })
  }

  const emitStop = () => {
    if(!isTypingRef.current) return;
    isTypingRef.current = false;
    socket.emit(EVENTS.TYPING_UPDATE, {
      chatKey,
      userId: user?.id,
      name: user?.name,
      isTyping: false
    })
  }

  const onChange = () => {
    emitStart();
    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStop();
    }, 1500);
  }

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get('content') as string;
    console.log(content)
    if(!content) return;
    sendMessage({
      chatKey,
      content: content.trim(),
      attachments: [],
      mentions: []
    })
    emitStop();
    // formData.delete('content')
    e.currentTarget.reset();
    fileInputRef.current = null;
  }

  return (
    <form className="border-t p-3" onSubmit={onSubmit}>
      {names.length > 0 && (
         <p className="px-4 text-xs text-muted-foreground">
         {names.length === 1
           ? `${names[0]} is typing…`
           : `${names.join(", ")} are typing…`}
       </p>
      )}
      <div className="flex items-end gap-2 rounded-xl border bg-card p-2">
        <Popover>
          <PopoverTrigger render={<Button type="button" variant="ghost" size="icon-sm" />}>
            <SmileIcon />
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="grid grid-cols-6 gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="rounded-md p-1.5 text-lg hover:bg-accent"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <PaperclipIcon />
        </Button>
        <input ref={fileInputRef} type="file" name="attachment" className="hidden" multiple />

        <Textarea
          name="content"
          placeholder="Write a message…"
          onChange={onChange}
          rows={1}
          className="min-h-9 flex-1 resize-none border-none px-1 shadow-none focus-visible:ring-0"
        />

        <Button type="submit" size="icon-sm">
          <SendIcon />
        </Button>
      </div>
    </form>
  );
};
