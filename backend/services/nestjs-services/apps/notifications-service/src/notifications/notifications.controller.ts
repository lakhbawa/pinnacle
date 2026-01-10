import { Controller, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getFeed(@Query('user_id') user_id: string, @Query('limit') limit?: number) {
    return this.notificationsService.getUserFeed(user_id, limit);
  }

  @Get('unread-count')
  async getUnreadCount(@Query('user_id') user_id: string) {
    const count = await this.notificationsService.getUnreadCount(user_id);
    return { count };
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Post('read-all')
  async markAllRead(@Query('user_id') user_id: string) {
    await this.notificationsService.markAllRead(user_id);
    return { success: true };
  }

  @Delete(':id')
  async dismiss(@Param('id') id: string) {
    return this.notificationsService.dismiss(id);
  }
}