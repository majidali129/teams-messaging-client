import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MessageAttachmentType, type MessageAttachment } from "@/types";

interface AttachmentPreviewDialogProps {
  attachment: MessageAttachment | null;
  onOpenChange: (open: boolean) => void;
}

export const AttachmentPreviewDialog = ({ attachment, onOpenChange }: AttachmentPreviewDialogProps) => {
  return (
    <Dialog open={!!attachment} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className=" border-none bg-transparent p-0 shadow-none ring-0 w-full! flex justify-center items-center max-w-fit!"
      >
        <DialogTitle className="sr-only">{attachment?.name ?? "Attachment preview"}</DialogTitle>
        {attachment?.resourceType === MessageAttachmentType.image ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="block max-h-[50vh] max-w-[50vw]  h-auto rounded-lg object-contain"
          />
        ) : attachment?.resourceType === MessageAttachmentType.video ? (
          <video
            key={attachment.url}
            src={attachment.url}
            controls
            autoPlay
            className="block max-h-[50vh] max-w-[50vw] w-auto h-auto rounded-lg"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
