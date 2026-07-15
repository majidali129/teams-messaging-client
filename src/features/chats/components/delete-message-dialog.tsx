

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import type { DeleteMessageInput, Message } from "@/types";
  import { TrashIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
  
  interface DeleteMessageDialogProps {
    message: Message;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    deleteMessage: (input: DeleteMessageInput) => void;
  }

  export const DeleteMessageDialog = ({
    message,
    open,
    setOpen,
    deleteMessage,
  }: DeleteMessageDialogProps) => {
      const handleDeleteMessage = () => {
        deleteMessage({ messageId: message.id, chatKey: message.chatKey });
        setOpen(false);
      }
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              You will delete this message for everyone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive"
              onClick={handleDeleteMessage}>
              <TrashIcon />
              Delete message
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  