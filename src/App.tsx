import { Navigate, Route, Routes } from "react-router";
import { AuthLayout } from "./features/auth/components/auth-layout";
import { SignUpForm } from "./features/auth/components/sign-up-form";
import { SignInForm } from "./features/auth/components/sign-in-form";
import { ForgotPasswordForm } from "./features/auth/components/forgot-password-form";
import { ResetPasswordForm } from "./features/auth/components/reset-password-form";
import { VerifyEmailForm } from "./features/auth/components/verify-email-form";
import { UpdatePasswordForm } from "./features/auth/components/update-password-form";
import { OnboardingPage } from "./features/onboarding/components/onboarding-page";
import { InviteAcceptPage } from "./features/invites/components/invite-accept-page";
import { AppLayout } from "./components/shared/app-layout";
import { WorkspacesIndexPage } from "./features/workspaces/components/workspaces-index-page";
import { WorkspacesAllPage } from "./features/workspaces/components/workspaces-all-page";
import { WorkspaceDetailsLayout } from "./features/workspaces/components/workspaces-details-layout";
import { WorkspaceOverviewTab } from "./features/workspaces/components/overview/workspace-overview-tab";
import { WorkspaceMembersTab } from "./features/workspaces/components/members/workspace-members-tab";
import { WorkspaceInvitesTab } from "./features/workspaces/components/invites/workspace-invites-tab";
import { WorkspaceChatsTab } from "./features/chats/components/workspace-chats-tab";
import { ProtectRoute } from "./components/shared/protect-route";

function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUpForm />} />
        <Route path="sign-in" element={<SignInForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="reset-password" element={<ResetPasswordForm />} />
        <Route path="verify-email" element={<VerifyEmailForm />} />
        <Route path="update-password" element={<UpdatePasswordForm />} />
      </Route>

      <Route path="on-boarding" element={<OnboardingPage />} />
      <Route path="invites/accept" element={<InviteAcceptPage />} />

      <Route element={<ProtectRoute><AppLayout /></ProtectRoute>}>
        <Route index element={<Navigate to="/workspaces" replace />} />
        <Route path="workspaces">
          <Route index element={<WorkspacesIndexPage />} />
          <Route path="all" element={<WorkspacesAllPage />} />
          <Route path=":id" element={<WorkspaceDetailsLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<WorkspaceOverviewTab />} />
            <Route path="members" element={<WorkspaceMembersTab />} />
            <Route path="invites" element={<WorkspaceInvitesTab />} />
            <Route path="chats" element={<WorkspaceChatsTab />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
