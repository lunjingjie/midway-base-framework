import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1751355396940_3387',
  koa: {
    port: 7001,
  },
  // 添加TypeORM配置
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '',
        port: 3306,
        username: 'root',
        password: '',
        database: '',
        synchronize: true, // 开发环境下使用，生产环境建议关闭
        logging: true,
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
  },
  // JWT配置
  jwt: {
    secret: 'ICSJsjkaSn&$d', // 密钥
    expiresIn: '24h', // token过期时间
  },
} as MidwayConfig;
