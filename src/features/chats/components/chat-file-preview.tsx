import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

interface ChatFilePreviewProps {
    preview: string;
    onFileRemove: () => void;
    uploading: boolean;
}

export const ChatFilePreview = ({preview, onFileRemove, uploading}: ChatFilePreviewProps) => {
    return (
        <div className={`relative w-32 h-32 ${uploading ? 'opacity-50' : ''}`}>
           <Button size="icon-sm" variant="ghost" className="absolute top-1.5 right-1 bg-accent/40! rounded z-20" onClick={onFileRemove}>
            <XIcon className="w-5 h-5 text-destructive" />
           </Button>
            <img src={preview} alt="File Preview" className="w-full h-full object-cover rounded opacity-95 z-10" />
          </div>
    )
}