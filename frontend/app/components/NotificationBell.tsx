import {useNotifications} from "@/app/hooks/useNotifications";
import {NotificationItem} from "@/app/components/NotificationItem";

export function NotificationBell() {
    const {notifications, unreadCount} = useNotifications('user-001');

    return (
        <div className="relative">
            {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
            )}

            <div className="dropdown">
                {notifications.map(n => (
                    <NotificationItem key={n.id} notification={n} />
                ))}
            </div>
        </div>
    );
}