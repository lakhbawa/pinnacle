import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {getTraceContext} from "@app/common/kafka/src/tracing/tracing.context";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  async send(
    recipientId: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ): Promise<void> {
    const { traceId, correlationId } = getTraceContext();

    // Get user email from database
    const userEmail = await this.getUserEmail(recipientId);

    // Send via SendGrid/SES
    // await this.sendgrid.send({
    //   to: userEmail,
    //   subject: title,
    //   html: this.renderEmailTemplate(title, body, data),
    // });

    this.logger.log({
      message: 'Email sent',
      recipientId,
      email: userEmail,
      subject: title,
      traceId,
      correlationId,
    });
  }

  private async getUserEmail(userId: string): Promise<string> {
    // From database
    return 'user@example.com';
  }

  private renderEmailTemplate(
    title: string,
    body: string,
    data: Record<string, any>,
  ): string {
    return `
      <html>
        <body>
          <h1>${title}</h1>
          <p>${body}</p>
          <a href="${data.deepLink || '#'}">View Details</a>
        </body>
      </html>
    `;
  }
}