import { Global, Module } from '@nestjs/common';
import { GracefulShutdownService } from './graceful-shutdown.service';

/**
 * 全域優雅關閉模組。
 *
 * @class
 */
@Global()
@Module({
  providers: [GracefulShutdownService],
  exports: [GracefulShutdownService],
})
export class GracefulShutdownModule {}
