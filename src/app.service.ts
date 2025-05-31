import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 提供應用程式層級操作的服務。
 *
 * @class
 */
@Injectable()
export class AppService {
  /**
   * @param configService - 用於存取應用程式設定的 ConfigService 實例。
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * 從設定服務取得目前的應用程式版本。
   * 如果未設定版本，則預設為 '1.0.0'。
   *
   * @returns {string} 應用程式版本。
   */
  getAppVersion(): string {
    return this.configService.get<string>('APP_VER', '1.0.0');
  }
}
