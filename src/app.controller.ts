import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * 處理應用程式根路由的控制器。
 *
 * @class
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 處理 GET 請求，回傳歡迎訊息。
   *
   * @returns 歡迎訊息字串
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
