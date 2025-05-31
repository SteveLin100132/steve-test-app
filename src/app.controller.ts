import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  createApiResponseDto,
  PingResponseDto,
  ServerInternalErrorResponseDto,
} from './common';

/**
 * 處理應用程式根路由的控制器。
 *
 * @class
 */
@Controller()
export class AppController {
  /**
   * @param appService - 用於處理應用程式邏輯的 AppService 實例。
   */
  constructor(private readonly appService: AppService) {}

  /**
   * 提供健康檢查的 API 端點，供外部服務（如 Kubernetes）監測應用程式是否正常運作。
   *
   * @returns {PingResponseDto} 應用程式的版本字串，作為健康狀態的回應。
   */
  @Get('/ping')
  @ApiOkResponse({
    description: '取得 API 健康狀態',
    type: createApiResponseDto(PingResponseDto),
    isArray: false,
  })
  @ApiInternalServerErrorResponse({
    description: '伺服器內部錯誤',
    type: createApiResponseDto(ServerInternalErrorResponseDto),
  })
  ping(): PingResponseDto {
    return {
      version: this.appService.getAppVersion(),
    };
  }
}
