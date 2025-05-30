import { Injectable } from '@nestjs/common';

/**
 * 提供應用程式層級操作的服務。
 *
 * @class
 */
@Injectable()
export class AppService {
  /**
   * 回傳問候訊息。
   *
   * @returns {string} 一個簡單的 "Hello World!" 訊息。
   */
  getHello(): string {
    return 'Hello World!';
  }
}
