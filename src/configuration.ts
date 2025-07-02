import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import { DefaultErrorFilter } from './filter/default.filter';
import { FormatMiddleware } from './middleware/format.middle';
import { ValidateErrorFilter } from './filter/validate.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import * as swagger from '@midwayjs/swagger';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, FormatMiddleware]);
    // add filter
    this.app.useFilter([
      ValidateErrorFilter,
      NotFoundFilter,
      DefaultErrorFilter,
    ]);
  }
}
