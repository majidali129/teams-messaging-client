import { filesApi } from "@/api/services/files"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useGetUploadSignature = (file: File | null) => {
    const { data, isLoading: gettingSignature } = useQuery({
        queryKey: queryKeys.uploads.getSignature(),
        queryFn: () => filesApi.getUploadSignature(),
        enabled: !!file,
    })
    return {
        signatureData: data,
        gettingSignature
    } as const
}