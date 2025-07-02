import { MidwayError } from '@midwayjs/core';
import { ResponseCode } from '../constants/response.constants';

export class BaseError extends MidwayError {
  code: number;

  constructor(message: string, code: number = ResponseCode.INTERNAL_ERROR) {
    super(message);
    this.code = code;
  }
}

export class BusinessError extends BaseError {
  constructor(message: string, code: number = ResponseCode.BAD_REQUEST) {
    super(message, code);
  }
}
