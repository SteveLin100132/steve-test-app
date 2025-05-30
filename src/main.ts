import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * 啟動 NestJS 應用程式。
 *
 * - 使用根模組 `AppModule` 初始化應用。
 * - 配置 Swagger，用於 API 文件，包含自訂標題、描述與版本號。
 * - 在 `/api` 路徑下設置 Swagger UI。
 * - 應用監聽 `PORT` 環境變數指定的埠號，預設為 3000。
 *
 * @async
 * @returns {Promise<void>} 應用啟動後回傳的 Promise。
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Steve APP example')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
