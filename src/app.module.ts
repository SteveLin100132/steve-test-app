import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './common';

/**
 * 應用程式的根模組。
 *
 * @class
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  /**
   * 設定中介軟體，將 LoggingMiddleware 應用於所有路由。
   *
   * @param {MiddlewareConsumer} consumer - NestJS 的 MiddlewareConsumer，用於配置中介軟體。
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
