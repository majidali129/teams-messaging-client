# Team Collaboration Client

React + TypeScript + Vite frontend for the team collaboration platform — Slack/Discord-style workspaces, channels, DMs, and invites, with real-time chat over Socket.IO.

## Stack

- React 19, TypeScript, Vite
- React Router
- TanStack Query (server state/cache)
- Tailwind CSS + shadcn/base-ui components
- Socket.IO client (real-time chat, presence, typing)
- Axios (REST), Cloudinary (uploads), `sonner` (toasts)

## Getting started

```bash
pnpm install
cp .env-example .env   # fill in VITE_API_URL
pnpm dev
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API server (REST + Socket.IO both use this) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Lint the codebase |

## App flow

The app is **workspace-scoped (multi-tenant)**: a signed-in user can belong to several workspaces, each with its own members, invites, and chats. Almost everything after sign-in lives under `/workspaces/:id/...`, and the current workspace's data (members, chats, roles) never leaks across workspace boundaries — switching workspaces switches the whole context.

### 1. Auth

- **Sign up** (`/auth/sign-up`) / **Sign in** (`/auth/sign-in`) — email + password, issues a JWT access + refresh token pair (stored client-side, attached to requests and the socket handshake).
- Forgot/reset password and email verification screens exist as UI shells for a future full implementation.
- `ProtectRoute` gates every authenticated route on the current user being resolved before rendering, so the rest of the app can rely on a signed-in user being available.

### 2. Workspaces (tenants)

- After sign-in, users land on `/workspaces`, listing every workspace they belong to (`/workspaces/all` for the full list/grid).
- Creating a workspace makes the creator its **owner**; owners get management rights (invite members, edit/delete the workspace, remove members) that regular members don't.
- Opening a workspace (`/workspaces/:id`) loads it once and shares that context (header, tab nav) across its **Overview**, **Members**, **Invites**, and **Chats** tabs.

### 3. Invites → Members

- Owners invite people by email + role from the workspace's **Invites** tab; the API emails an invite link and the invite also shows up in the recipient's notification bell if they already have an account.
- Clicking the invite link opens a standalone **accept/decline** landing page (works for both logged-in and new users — it routes through sign-in/sign-up and back if needed) before landing the user on the workspace.
- Accepted invites turn into workspace **members** (visible in the Members tab), with roles determining who can manage the workspace and who can just participate.

### 4. Chats → Messages

- The **Chats** tab lists the workspace's direct messages and group channels, with unread counts and a live-updating last-message preview.
- Opening a chat connects to its Socket.IO room for real-time delivery: typing indicators, presence, read receipts, and instant message delivery to every participant, even ones not currently viewing that chat.
- Sending a message (text and/or a file attachment) shows an optimistic message immediately, uploads any attachment to Cloudinary in the background, then reconciles with the server-confirmed message — with edit/delete supported afterwards.
