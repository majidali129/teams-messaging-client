import type { User } from "@/types";
import { httpClient } from "../client";


export const usersApi = {
    getCurrentUser: () => httpClient.get<User>('/users/current-user'),
}