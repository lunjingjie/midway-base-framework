import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { WeatherService } from '../service/weather.service';
import { WeatherInfo } from '../interface';
import { Validate } from '@midwayjs/validate';
import { WeatherDTO } from '../dto/weather.dto';
import { ApiOperation, ApiResponse } from '@midwayjs/swagger';
import { WeatherVO } from '../vo/weatherVO';

@Controller('/')
export class WeatherController {
  @Inject()
  weatherService: WeatherService;

  /**
   * @description 获取天气信息
   * @author lunjingjie
   * @date 2025-07-02
   */
  @ApiOperation({ summary: '获取天气信息' })
  @ApiResponse({
    status: 200,
    description: '获取天气信息成功',
    type: WeatherVO,
  })
  @Get('/weather')
  @Validate()
  async getWeatherInfo(@Query() dto: WeatherDTO): Promise<WeatherInfo> {
    return this.weatherService.getWeather(dto.cityId);
  }
}
