// Auth
export const signUpPath = () => "/auth/sign-up";
export const signInPath = () => "/auth/sign-in";
export const forgotPasswordPath = () => "/auth/forgot-password";
export const resetPasswordPath = () => "/auth/reset-password";
export const verifyEmailPath = () => "/auth/verify-email";
export const updatePasswordPath = () => "/auth/update-password";

// Onboarding
export const onboardingPath = () => "/on-boarding";

// Workspaces
export const homePath = () => "/";
export const workspacesPath = () => "/workspaces";
export const allWorkspacesPath = () => "/workspaces/all";
export const workspacePath = (id: string) => `/workspaces/${id}`;
export const workspaceOverviewPath = (id: string) => `/workspaces/${id}/overview`;
export const workspaceMembersPath = (id: string) => `/workspaces/${id}/members`;
export const workspaceInvitesPath = (id: string) => `/workspaces/${id}/invites`;
export const workspaceChatsPath = (id: string) => `/workspaces/${id}/chats`;

// Profile
export const settingsPath = () => "/settings";
export const profilePath = () => "/settings/profile";