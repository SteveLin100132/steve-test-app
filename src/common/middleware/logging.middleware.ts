import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * 中介軟體，用於記錄 API 請求和回應的日誌。
 *
 * @class
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  /**
   * 日誌記錄器實例，用於輸出 API 請求和回應的日誌。
   */
  private readonly logger = new Logger('API');

  /**
   * 記錄請求和回應的日誌
   *
   * @param {Request} req - Express 請求對象，包含請求的詳細資訊。
   * @param {Response} res - Express 回應對象，用於發送回應。
   */
  private log(req: Request, res: Response) {
    // 獲取請求的 HTTP 方法和原始 URL
    const { method, originalUrl } = req;

    // 獲取回應的狀態碼和追蹤 ID
    const statusCode = res.statusCode;
    const traceId = String(res.getHeader('X-Trace-Id') || 'not-set');

    // 輸出日誌，包含請求方法、原始 URL、狀態碼和追蹤 ID
    this.logger.log(
      `${method} ${originalUrl} - Status: ${statusCode} - TraceId: ${traceId}`,
    );
  }

  /**
   * 中介軟體的主要邏輯，用於處理 API 請求和回應。
   *
   * @param {Request} req - Express 請求對象，包含請求的詳細資訊。
   * @param {Response} res - Express 回應對象，用於發送回應。
   * @param {NextFunction} next - Express 中介軟體的下一個函數，用於將控制權傳遞給下一個中介軟體。
   */
  use(req: Request, res: Response, next: NextFunction) {
    // 監聽 response 的 'error' 事件
    res.on('error', () => this.log(req, res));

    // 監聽 response 結束事件
    res.on('finish', () => this.log(req, res));

    next();
  }
}
