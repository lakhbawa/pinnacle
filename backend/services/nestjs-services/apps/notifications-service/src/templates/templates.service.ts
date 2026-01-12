import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {PrismaService} from "../prisma.service";

interface RenderedContent {
    title: string;
    body: string;
}

@Injectable()
export class TemplatesService implements OnModuleInit {
    private readonly logger = new Logger(TemplatesService.name);
    private templates = new Map<string, { title_template: string; body_template: string }>();

    constructor(private prisma: PrismaService) {
    }

    async onModuleInit() {
        try {
            await this.loadTemplates();
            this.logger.log('Templates loaded successfully');
        } catch (error) {
            this.logger.warn('Failed to load templates on startup, will retry on first use', error);
            // App continues running, templates load lazily on first request
        }
    }

    private async loadTemplates() {
        const dbTemplates = await this.prisma.notificationTemplate.findMany();
        for (const t of dbTemplates) {
            this.templates.set(t.event_type, {
                title_template: t.title_template,
                body_template: t.body_template,
            });
        }
        this.logger.log(`Loaded ${this.templates.size} templates`);
    }

    render(event_type: string, data: Record<string, any>): RenderedContent {
        const template = this.templates.get(event_type);
        if (!template) {
            this.logger.warn(`No template for event: ${event_type}`);
            return {title: event_type, body: ''};
        }

        return {
            title: this.interpolate(template.title_template, data),
            body: this.interpolate(template.body_template, data),
        };
    }

    private interpolate(str: string, data: Record<string, any>): string {
        return str.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
    }

    async reloadTemplates() {
        await this.loadTemplates();
    }
}