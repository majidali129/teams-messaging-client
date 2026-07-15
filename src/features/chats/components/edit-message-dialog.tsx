import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MessageEditedPayload } from "@/sockets/types";

type EditMessageDialogProps = {
    message: Message
    open: boolean
    setOpen: (open: boolean) => void,
    editMessage: (input: MessageEditedPayload) => void
}
export const EditMessageDialog = ({ message, open, setOpen, editMessage }: EditMessageDialogProps) => {
    const [content, setContent] = useState(message.content)

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        editMessage({
            messageId: message.id,
            chatKey: message.chatKey,
            content: content,
            mentions: message.mentions?.map(m => m.id),
            attachments: message.attachments
        })
        setOpen(false)
     }

    return (
        <Dialog  open={open} onOpenChange={setOpen}>
            <DialogContent className="ring-0 border-0">
                <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea className="resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"  placeholder="Edit your message" value={content} onChange={(e) => setContent(e.target.value)} />
                        <div className="flex justify-end">

                    <Button type="submit" className="">Edit Message</Button>
                        </div>
                </form>
            </DialogContent>
        </Dialog>


    );
};
