# Steve Test App

一個基於 [NestJS](https://nestjs.com/)
框架的 TypeScript 伺服器端應用程式範例，結合 log4js 日誌管理，適合學習與實作高效能、可擴展的 Node.js 應用。

## 目錄結構

```
src/
  app.controller.ts         // 主要 API 控制器
  app.module.ts             // 主模組
  app.service.ts            // 服務層
  main.ts                   // 入口點
  common/                   // 共用元件（config, dto, filters, interceptors, middleware）
  config/logger.config.json // log4js 設定檔
  logger/                   // log4js 整合模組與服務
test/                       // 測試
```

## .env 設定

專案支援以 `.env` 檔案管理環境變數，常見設定如下：

```
# 伺服器監聽埠
PORT=3000

# 範例：資料庫連線字串
# DATABASE_URL=postgres://user:password@localhost:5432/dbname

# 範例：Log 等級
# LOG_LEVEL=info
```

請依需求於專案根目錄建立 `.env` 檔案，並於 `main.ts` 或相關設定檔載入（建議使用
[@nestjs/config](https://docs.nestjs.com/techniques/configuration) 套件）。

## 安裝

```bash
npm install
```

## 開發與執行

```bash
# 開發模式
npm run start

# 監聽檔案變更（熱重載）
npm run start:dev

# 生產模式
npm run start:prod
```

## 測試

```bash
# 單元測試
npm run test

# e2e 測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov
```

## 日誌管理

本專案採用 [log4js](https://github.com/log4js-node/log4js-node)
作為日誌系統，設定檔位於
`src/config/logger.config.json`，可依需求調整日誌輸出格式與等級。

## 部署

請參考 [NestJS 官方部署文件](https://docs.nestjs.com/deployment)
進行生產環境部署。

## 相關資源

- [NestJS 官方文件](https://docs.nestjs.com/)
- [log4js 文件](https://log4js-node.github.io/log4js-node/)
- [TypeScript 文件](https://www.typescriptlang.org/docs/)

## 授權

本專案採用 MIT 授權。
