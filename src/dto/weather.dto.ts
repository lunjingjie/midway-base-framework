import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
// import { ResponseCode } from '../constants/response.constants';
// import { BaseError } from '../error/base.error';

/**
 * @description 天气信息DTO
 * @author lunjingjie
 * @date 2025-07-02
 */
export class WeatherDTO {
  /**
   * @description 城市ID
   */
  @ApiProperty({
    description: '城市ID',
    required: true,
  })
  @Rule(RuleType.string().required())
  cityId: string;
}
