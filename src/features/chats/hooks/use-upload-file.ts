import { filesApi } from "@/api/services/files"
import { useMutation } from "@tanstack/react-query"


export const useUploadFile = () => {
    const { mutateAsync: uploadFile, isPending: uploadingFile } = useMutation({
        mutationFn: (data: {url: string,formData: FormData}) => filesApi.uploadFile(data.url, data.formData),
    })
    return { uploadFile, uploadingFile }
}