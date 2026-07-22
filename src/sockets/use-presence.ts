import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const usePresence = () => {
    const {data} = useQuery<Set<String>>({
        queryKey: queryKeys.presence.snapshot(),
        queryFn: () => new Set<string>(),
        initialData: new Set<string>(),
        staleTime:Infinity
    });

    return data?? new Set<string>();
}