import {io, Socket} from 'socket.io-client'

let socket: Socket|null = null;
export const socketInstance = () => {
    if(socket) return socket;

    socket = io(`${import.meta.env.VITE_API_URL}/chats`, {
        auth: {
            token: localStorage.getItem('access-token')
        },
        autoConnect: false,
        transports: ["websocket"]
    });

    return socket;
}

export const disconnectSocket = () => {
    if(!socket) return;
    socket.disconnect()
    socket = null;
}