import { Injectable, Logger } from '@nestjs/common';

import {EmailService} from "../channels/email.service";
import {NotificationRequestEvent} from "@app/common/kafka/src/interfaces/kafka-message.interface";
interface NotificationTemplate {
  titleTemplate: string;
  bodyTemplate: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // In production, load from database
  private templates: Map<string, NotificationTemplate> = new Map([
    ['project_completed', {
      titleTemplate: 'Project "{{projectName}}" is complete!',
      bodyTemplate: 'Congratulations! All tasks have been completed.',
    }],
    ['outcome_milestone', {
      titleTemplate: '{{projectName}} reached {{milestone}}%',
      bodyTemplate: 'Your project is {{milestone}}% complete.',
    }],
    ['welcome', {
      titleTemplate: 'Welcome to {{projectName}}',
      bodyTemplate: 'You\'ve been added to the project. Get started!',
    }],
  ]);

  constructor(
    private emailService: EmailService,
  ) {}

  async processNotificationRequest(event: NotificationRequestEvent): Promise<void> {
    const template = this.templates.get(event.templateCode);

    if (!template) {
      this.logger.warn(`Template not found: ${event.templateCode}`);
      return;
    }

    // Render template
    const title = this.renderTemplate(template.titleTemplate, event.data);
    const body = this.renderTemplate(template.bodyTemplate, event.data);

    // Process each recipient
    for (const recipientId of event.recipientIds) {
      // Get user preferences from database
      const preferences = await this.getUserPreferences(recipientId);

      for (const channel of event.channels) {
        if (!preferences[channel]) {
          this.logger.debug(`User ${recipientId} has ${channel} disabled`);
          continue;
        }

        await this.sendViaChannel(channel, recipientId, title, body, event.data);
      }
    }
  }


  async sendWelcomeNotification(data: { projectId: string; ownerId: string }): Promise<void> {
    await this.processNotificationRequest({
      recipientIds: [data.ownerId],
      templateCode: 'welcome',
      data: {
        projectId: data.projectId,
        projectName: 'New Project',
      },
      channels: ['email'],
    });
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }

  private async sendViaChannel(
    channel: string,
    recipientId: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ): Promise<void> {
    switch (channel) {

      case 'email':
        await this.emailService.send(recipientId, title, body, data);
        break;
    }
  }

  private async getUserPreferences(userId: string) {
    // From database
    return { in_app: true, email: true, push: false };
  }

  private async getProjectMembers(projectId: string): Promise<string[]> {
    return ['user-001', 'user-002'];
  }
}