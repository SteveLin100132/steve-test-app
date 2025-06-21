import * as log4js from 'log4js';

/**
 * 初始化 log4js 配置
 */
export function initLog4js() {
  log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      api: {
        type: 'file',
        filename: 'logs/api.log',
        maxLogSize: 10485760,
        pattern: '.yyyy-MM-dd',
        backups: 3,
        compress: true,
      },
    },
    categories: {
      default: { appenders: ['out', 'api'], level: 'all' },
      API: { appenders: ['out', 'api'], level: 'all' },
    },
  });
}
