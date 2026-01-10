import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Logger} from "@nestjs/common";

import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/notifications',
})

export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

      private readonly logger = new Logger(NotificationsGateway.name);
    private userSockets = new Map<string, Set<string>>();


    handleConnection(client: Socket) {
        const user_id = this.extractUserId(client);

        if (!user_id) {
            client.disconnect();
            return;
        }

        if (!this.userSockets.has(user_id)) {
            this.userSockets.set(user_id, new Set());
        }

        this.userSockets.get(user_id)?.add(client.id);

        client.join(`user:${user_id}`)

        this.logger.log(`User ${user_id} connected (socket: ${client.id})`);
    }

    handleDisconnect(client: Socket) {
        const user_id = this.extractUserId(client)
        if(user_id && this.userSockets.has(user_id)) {
            this.userSockets.get(user_id)?.delete(client.id); // try to understand that later

            if(this.userSockets.get(user_id)?.size === 0) {
                this.userSockets.delete(user_id);
            }
        }
        this.logger.log(`Socket ${client.id} disconnected`);
    }

    sendToUser(user_id: string, notification: any) {
        this.server.to(`user:${user_id}`).emit('notification', notification);
        this.logger.log(JSON.stringify(notification) + ` sent to user ${user_id}`);
    }

    sendUnreadCount(user_id: string, count: number) {
        this.server.to(`user:${user_id}`).emit('unread_count', { count });
    }

    private extractUserId(client: Socket): string | null {
        return (client.handshake.auth?.user_id || client.handshake.query?.user_id) as string;
    }
}