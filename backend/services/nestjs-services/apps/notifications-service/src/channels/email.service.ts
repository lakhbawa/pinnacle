import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface EmailContent {
  title: string;
  body: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {}

  async send(user_id: string, content: EmailContent): Promise<void> {
    const email = await this.getUserEmail(user_id);

    // TODO: Replace with SendGrid/SES
    this.logger.log({
      message: 'Email sent',
      to: email,
      subject: content.title,
    });

    // SendGrid example:
    // await this.sendgrid.send({
    //   to: email,
    //   from: this.config.get('EMAIL_FROM'),
    //   subject: content.title,
    //   html: this.renderHtml(content),
    // });
  }

  private async getUserEmail(user_id: string): Promise<string> {
    // TODO: Fetch from users service or cache
    return 'user@example.com';
  }

  private renderHtml(content: EmailContent): string {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>${content.title}</h1>
          <p>${content.body}</p>
        </body>
      </html>
    `;
  }
}