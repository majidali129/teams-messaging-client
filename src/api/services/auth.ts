import type { SignInInput, SignInResponse, SignUpInput, User } from "@/types";
import { httpClient } from "../client";

export const authApi = {
    signUp: (input: SignUpInput) => httpClient.post<User>('/auth/sign-up',input),
    signIn: (input: SignInInput) => httpClient.post<SignInResponse>('/auth/sign-in', input),
    logout: () => httpClient.patch<void>('/auth/logout'),
    refreshToken: () => httpClient.patch<SignInResponse>('/auth/refresh-token')
}