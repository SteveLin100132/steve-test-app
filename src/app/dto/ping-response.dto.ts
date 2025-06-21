import { ApiProperty } from '@nestjs/swagger';

/**
 * ping 請求的回應 DTO。
 *
 * @property version - 應用程式或服務的版本字串。
 */
export class PingResponseDto {
  /**
   * ping 回應的唯一識別碼。
   *
   * @example "834ef93d-7f22-4876-b0b2-c4e1f3fd1fad"
   */
  @ApiProperty({
    type: 'string',
    example: '834ef93d-7f22-4876-b0b2-c4e1f3fd1fad',
  })
  id: string;

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
