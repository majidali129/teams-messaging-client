

export const queryKeys = {
    workspaces: {
        all: ['workspaces'] as const,
        details: (id: string) => ['workspaces', id] as const,
        members: (id: string) => ['workspaces', id, 'members'] as const
    },
    chats: {
        all: (workspaceId: string) => ['chats', workspaceId] as const,
        details: (chatKey: string) => ['chats', chatKey] as const,
        messages: (chatKey: string) => ['chats', chatKey, 'messages'] as const
    },
    users: {
        current: ['users', 'current'] as const
    },
    invites: {
        received: () => ['invites', 'received'] as const,
        all: (workspaceId: string) => ['invites', workspaceId] as const
    }
}