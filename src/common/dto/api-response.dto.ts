import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 動態建立通用 API 回應 DTO 類別，用於標準化 HTTP 回應格式。
 *
 * @template T - 回應資料的型別。
 * @param TClass - 回應資料型別的類別（Class）。
 * @returns 動態產生的 ApiResponseDto 類別，包含標準 API 回應欄位。
 *
 * @example
 * class UserDto { ... }
 * const UserResponseDto = createApiResponseDto(UserDto);
 */
export function createApiResponseDto<T>(TClass: Type<T>): any {
  // 動態生成類別名稱
  // 如果 TClass 為 undefined，則使用 'ApiResponseDto' 作為預設名稱
  const className = TClass ? `${TClass.name}ApiResponseDto` : 'ApiResponseDto';

  /**
   * 通用 API 回應 DTO，用於標準化 HTTP 回應格式。
   *
   * @template T - 回應資料的型別。
   *
   * @property success - 請求是否成功。
   * @property code - 回應的 HTTP 狀態碼。
   * @property message - 描述回應的人類可讀訊息。
   * @property data - 可選，包含回應資料的 payload。
   * @property errors - 可選，錯誤細節的陣列。
   * @property timestamp - 產生回應時的 ISO 字串時間。
   * @property traceId - 可選，用於追蹤請求的唯一識別碼。
   */
  const DynamicApiResponseDto = class ApiResponseDto<T = any> {
    /**
     * 指示 API 請求是否成功。
     * @example true
     */
    success: boolean;

    /**
     * API 回應所回傳的 HTTP 狀態碼。
     * @example 200
     */
    code: number;

    /**
     * 描述回應的人類可讀訊息。
     * @example 'Request successful'
     */
    message: string;

    /**
     * 包含回應資料的 payload（可選）。
     */
    data?: T;

    /**
     * 錯誤細節的陣列（可選）。
     */
    errors?: any[];

    /**
     * 產生回應時的 ISO 字串時間。
     * @example '2025-05-31T14:06:00.789Z'
     */
    timestamp: string;

    /**
     * 用於追蹤請求的唯一識別碼（可選）。
     * @example 'f1ef7c1c-b0a5-4f79-bc61-3bb28fd9d181'
     */
    traceId?: string;
  };

  // 使用 ApiProperty 裝飾器定義屬性，並提供 Swagger 文件的描述和範例
  ApiProperty({
    type: 'boolean',
    description: '指示 API 請求是否成功。',
    example: true,
  })(DynamicApiResponseDto.prototype, 'success');

  ApiProperty({
    type: 'number',
    description: 'API 回應所回傳的 HTTP 狀態碼。',
    example: 200,
  })(DynamicApiResponseDto.prototype, 'code');

  ApiProperty({
    type: 'string',
    description: '描述回應的人類可讀訊息。',
    example: 'Request successful',
  })(DynamicApiResponseDto.prototype, 'message');

  ApiProperty({
    type: TClass,
    required: false,
    description: '包含回應資料的 payload（可選）。',
  })(DynamicApiResponseDto.prototype, 'data');

  ApiProperty({
    required: false,
    type: 'array',
    description: '錯誤細節的陣列（可選）。',
  })(DynamicApiResponseDto.prototype, 'errors');

  ApiProperty({
    type: 'string',
    description: '產生回應時的 ISO 字串時間。',
    example: '2025-05-31T14:06:00.789Z',
  })(DynamicApiResponseDto.prototype, 'timestamp');

  ApiProperty({
    type: 'string',
    required: false,
    description: '用於追蹤請求的唯一識別碼（可選）。',
    example: 'f1ef7c1c-b0a5-4f79-bc61-3bb28fd9d181',
  })(DynamicApiResponseDto.prototype, 'traceId');

  // 設定類別名稱
  Object.defineProperty(DynamicApiResponseDto, 'name', { value: className });
  return DynamicApiResponseDto;
}
