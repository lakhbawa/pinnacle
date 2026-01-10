interface NotificationItemProps {
    notification: {
        id: string;
        type: string;
        title: string;
        body: string;
        data: any;
        created_at: string;
        read: boolean;
    };
}

export function NotificationItem({notification}: NotificationItemProps) {
    return (
        <div className={`p-4 border-b ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-gray-600">{notification.body}</p>
            <span className="text-xs text-gray-400">
        {new Date(notification.created_at).toLocaleString()}
      </span>
        </div>
    );
}