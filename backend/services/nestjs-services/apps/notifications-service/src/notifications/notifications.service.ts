import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TemplatesService } from '../templates/templates.service';
import { EmailService } from '../channels/email.service';
import { NotificationsGateway } from './notifications.gateway';

interface EventData {
  actor_id: string;
  actor_name?: string;
  recipient_ids: string[];
  target_type: string;
  target_id: string;
  [key: string]: any;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private templates: TemplatesService,
    private email: EmailService,
    private gateway: NotificationsGateway,
  ) {}

  async handleEvent(event_type: string, data: EventData) {
    const recipients = data.recipient_ids.filter(id => id !== data.actor_id);

    if (recipients.length === 0) {
      this.logger.debug(`No recipients for ${event_type}`);
      return;
    }

    // Render template
    // const content = this.templates.render(event_type, data);

    const content = {
      title: "Test Notification",
      body: "Test Notification Body"
    }
    // Create notification with recipients
    const notification = await this.prisma.notification.create({
      data: {
        type: event_type,
        title: content.title,
        body: content.body,
        actor_type: 'user',
        actor_id: data.actor_id,
        target_type: data.target_type,
        target_id: data.target_id,
        data: data,
        recipients: {
          createMany: {
            data: recipients.map(user_id => ({ user_id })),
          },
        },
      },
      include: { recipients: true },
    });

    for (const recipient of notification.recipients) {
      this.gateway.sendToUser(recipient.user_id, {
        id: notification.id,
        recipient_id: recipient.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        created_at: notification.created_at,
        read: false,
      });

      const count = await this.getUnreadCount(recipient.user_id);
      this.gateway.sendUnreadCount(recipient.user_id, count);

      const prefs = await this.getPreferences(recipient.user_id);
      if (prefs.email) {
        await this.email.send(recipient.user_id, content);
      }
    }

    this.logger.log(`Notification ${event_type} sent to ${recipients.length} recipients`);
  }

  async getUserFeed(user_id: string, limit = 50) {
    return this.prisma.notificationRecipient.findMany({
      where: { user_id, dismissed_at: null },
      include: { notification: true },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async getUnreadCount(user_id: string): Promise<number> {
    return this.prisma.notificationRecipient.count({
      where: { user_id, read_at: null, dismissed_at: null },
    });
  }

  async markRead(recipient_id: string) {
    const recipient = await this.prisma.notificationRecipient.update({
      where: { id: recipient_id },
      data: { read_at: new Date() },
    });

    const count = await this.getUnreadCount(recipient.user_id);
    this.gateway.sendUnreadCount(recipient.user_id, count);

    return recipient;
  }

  async markAllRead(user_id: string) {
    await this.prisma.notificationRecipient.updateMany({
      where: { user_id, read_at: null },
      data: { read_at: new Date() },
    });

    this.gateway.sendUnreadCount(user_id, 0);
  }

  async dismiss(recipient_id: string) {
    const recipient = await this.prisma.notificationRecipient.update({
      where: { id: recipient_id },
      data: { dismissed_at: new Date() },
    });

    const count = await this.getUnreadCount(recipient.user_id);
    this.gateway.sendUnreadCount(recipient.user_id, count);

    return recipient;
  }

  private async getPreferences(user_id: string) {
    const prefs = await this.prisma.notificationPreference.findMany({
      where: { user_id },
    });

    // Default: all enabled
    return {
      in_app: prefs.find(p => p.channel === 'in_app')?.enabled ?? true,
      email: prefs.find(p => p.channel === 'email')?.enabled ?? true,
    };
  }
}