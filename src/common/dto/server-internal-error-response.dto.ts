import { ApiProperty } from '@nestjs/swagger';

/**
 * 代表伺服器內部錯誤回應的資料傳輸物件（DTO）。
 * 此類別可擴充或用於標準化伺服器內部錯誤（HTTP 500）的回應格式。
 *
 * @remarks
 * 通常用於封裝伺服器發生非預期狀況時回傳的錯誤資訊。
 */
export class ServerInternalErrorResponseDto {
  /**
   * 錯誤訊息，描述伺服器內部錯誤的詳細資訊。
   * @example 'An unexpected error occurred.'
   */
  @ApiProperty({
    type: 'string',
    example: 'An unexpected error occurred.',
    required: true,
    description: '錯誤訊息，描述伺服器內部錯誤的詳細資訊。',
  })
  message: string;
}
