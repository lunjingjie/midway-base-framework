import { makeHttpRequest, Provide } from '@midwayjs/core';
import { WeatherInfo } from '../interface';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';
// import { WeatherEmptyDataError } from '../error/weather.error';

@Provide()
export class WeatherService {
  async getWeather(cityId: string): Promise<WeatherInfo> {
    if (!cityId) {
      throw new BusinessError('cityId不能为空', ResponseCode.BAD_REQUEST);
    }

    const result = await makeHttpRequest<WeatherInfo>(
      `https://midwayjs.org/resource/${cityId}.json`,
      {
        dataType: 'json',
      },
    );

    if (result.status === 200) {
      return result.data as WeatherInfo;
    }
  }
}
