import { Button } from "@/components/ui/button"
import { FileIcon, PlayIcon, XIcon } from "lucide-react"
import { getAttachmentType } from "@/lib/attachment"
import { MessageAttachmentType } from "@/types"

interface ChatFilePreviewProps {
    file: File;
    preview: string;
    onFileRemove: () => void;
    uploading: boolean;
}

export const ChatFilePreview = ({ file, preview, onFileRemove, uploading }: ChatFilePreviewProps) => {
    let resourceType: MessageAttachmentType | null = null;
    try {
        resourceType = getAttachmentType(file);
    } catch {
        resourceType = null;
    }

    const renderPreview = () => {
        if (resourceType === MessageAttachmentType.image) {
            return (
                <img
                    src={preview}
                    alt={file.name}
                    className="z-10 h-full w-full rounded object-cover opacity-95"
                />
            );
        }

        if (resourceType === MessageAttachmentType.video) {
            return (
                <div className="relative z-10 h-full w-full">
                    <video src={preview} muted playsInline className="h-full w-full rounded object-cover opacity-95" />
                    <span className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                        <span className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white">
                            <PlayIcon className="size-4 fill-current" />
                        </span>
                    </span>
                </div>
            );
        }

        // pdf, audio, or any other non-visual attachment: no thumbnail is
        // possible, so show a file chip that opens the local preview
        // (blob URL) in a new tab, same as the sent-message view does.
        return (
            <a
                href={preview}
                target="_blank"
                rel="noreferrer"
                className="z-10 flex h-full w-full flex-col items-center justify-center gap-1 rounded border border-current/15 bg-muted/40 px-2 text-center"
            >
                <FileIcon className="size-6 shrink-0" />
                <span className="line-clamp-2 break-all text-[11px] text-muted-foreground">{file.name}</span>
            </a>
        );
    };

    return (
        <div className={`relative w-32 h-32 ${uploading ? 'opacity-50' : ''}`}>
            <Button size="icon-sm" variant="ghost" className="absolute top-1.5 right-1 bg-accent/40! rounded z-20" onClick={onFileRemove}>
                <XIcon className="w-5 h-5 text-destructive" />
            </Button>
            {renderPreview()}
        </div>
    )
}
