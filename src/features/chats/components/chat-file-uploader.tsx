import { PaperclipIcon } from "lucide-react"
import { type ChangeEvent } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ChatFileUploaderProps {
    onFileChange: (file: File | null) => void;
    file: File | null;
}
export const ChatFileUploader = ({ onFileChange, file }: ChatFileUploaderProps) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (file) {
            onFileChange(null);
        }
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const selectedFile = files[0];
        if (!validateFile(selectedFile)) return;
        onFileChange(selectedFile);
    }

    const validateFile = (file: File) => {
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size is too large. Maximum size is 5MB.');
            return false;
        }
        return true;
    }


    return (
        <label htmlFor="attachment-upload" className=" hover:bg-muted rounded w-8 p-1.25 h-8 flex items-center justify-center">
            <PaperclipIcon />
            <input
                id="attachment-upload"
                onChange={handleFileChange}
                type="file"
                name="attachment"
                className="hidden"
                multiple
            />
        </label>
    )
}