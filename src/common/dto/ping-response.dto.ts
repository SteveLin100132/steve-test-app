import { ApiProperty } from '@nestjs/swagger';

/**
 * ping 請求的回應 DTO。
 *
 * @property version - 應用程式或服務的版本字串。
 */
export class PingResponseDto {
  /**
   * 應用程式或服務的版本字串。
   * @example '1.0.0'
   */
  @ApiProperty({
    type: 'string',
    description: '應用程式或服務的版本字串。',
    example: '1.0.0',
  })
  version: string;
}
