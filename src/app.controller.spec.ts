import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    /**
     * 代表為單元測試所建立的 NestJS 測試模組實例。
     *
     * `app` 變數是一個 `TestingModule` 實例，配置了 `AppController` 與 `AppService`
     * 作為其控制器與提供者。此模組透過 `Test.createTestingModule` 建立並編譯，
     * 可用於取得控制器與服務的實例，以進行隔離測試。
     *
     * @remarks
     * 這通常用於測試套件的初始化階段，以建立測試用的應用程式上下文。
     *
     * @see {@link https://docs.nestjs.com/fundamentals/testing#unit-testing}
     */
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return APP version', () => {
      expect(appController.ping().version).toBe('1.0.0');
    });
  });
});
