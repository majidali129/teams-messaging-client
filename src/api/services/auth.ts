import type { SignInInput, SignUpInput, User } from "@/types";
import { httpClient } from "../client";

export const authApi = {
    signUp: (input: SignUpInput) => httpClient.post<User>('/auth/sign-up',input),
    signIn: (input: SignInInput) => httpClient.post<{message: string, accessToken: string, refreshToken: string}>('/auth/sign-in', input),
    logout: () => httpClient.patch<void>('/auth/logout'),
    refreshToken: () => httpClient.patch<{message: string, accessToken: string, refreshToken: string}>('/auth/refresh-token')
}