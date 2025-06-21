import * as log4js from 'log4js';
import rawConfig from '../../config/logger.config.json';

const config: log4js.Configuration = rawConfig as log4js.Configuration;

/**
 * 初始化 log4js 配置
 */
export function initLog4js() {
  log4js.configure(config);
}
