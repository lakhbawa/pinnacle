import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    data: any;
    created_at: string;
    read: boolean;
}

export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io("http://localhost:4470/notifications", {
            auth: {user_id: userId}
        });

        s.on('connect', () => console.log("Connected to notifications"));

        s.on('notification', (notif: Notification) => {
            setNotifications(prev => [notif, ...prev]);
        });

        s.on('unread_count', ({count}: { count: number }) => {
            setUnreadCount(count);
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [userId]);

    return {notifications, unreadCount, socket};
}