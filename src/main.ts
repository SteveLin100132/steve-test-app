import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter, ResponseInterceptor } from 'src/common';
import { Log4jsLoggerService } from 'src/logger';
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
  // 建立 NestJS 應用程式，關閉預設 logger
  const app = await NestFactory.create(AppModule, { logger: false });

  // 設定全域中介軟體，使用 log4js 記錄 API 請求與回應
  app.useLogger(new Log4jsLoggerService());

  // 設定 Swagger 文件
  const apiDocDescription =
    'The API description<br><a href="/swagger-json" target="_blank">OpenAPI Spec JSON</a>';
  const config = new DocumentBuilder()
    .setTitle('Steve APP example')
    .setDescription(apiDocDescription)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // 提供 /swagger-json 路徑給 Swagger UI 讀取 OpenAPI spec
  app.use('/swagger-json', (req, res) => res.json(document));

  // 設定 Swagger UI 在根目錄，並指定 spec 路徑
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      url: '/swagger-json',
    },
  });

  // 設定全域攔截器與例外處理
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // 啟動應用程式，監聽指定的埠號
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
