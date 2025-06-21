import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { Log4jsLoggerService } from 'src/logger';

/**
 * GracefulShutdownService 是一個實現了 OnModuleDestroy、BeforeApplicationShutdown 和 OnApplicationShutdown 接口的服務，
 * 用於處理 NestJS 應用的優雅關閉過程。
 *
 * @class
 */
@Injectable()
export class GracefulShutdownService
  implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown
{
  /**
   * 日誌服務實例，用於記錄關閉過程中的日誌。
   */
  private readonly logger = new Log4jsLoggerService('Shutdown');

  /**
   * 當模組被銷毀時觸發的回調函數。
   * 在這裡可以執行一些清理操作。
   */
  onModuleDestroy() {
    this.logger.log('onModuleDestroy: Module is being destroyed.');
  }

  /**
   * 在應用程序關閉之前觸發的回調函數。
   * 可以在這裡處理一些清理操作，例如關閉連接或釋放資源。
   *
   * @param {string} signal 接收到的關閉信號。
   */
  beforeApplicationShutdown(signal?: string) {
    this.logger.log(`beforeApplicationShutdown: Signal received: ${signal}`);
  }

  /**
   * 在應用程序關閉時觸發的回調函數。
   * 可以在這裡處理一些清理操作，例如關閉連接或釋放資源。
   *
   * @param {string} signal 接收到的關閉信號。
   */
  onApplicationShutdown(signal?: string) {
    this.logger.log(
      'onApplicationShutdown: Application shutdown started.',
      `Signal: ${signal}`,
    );
  }
}
