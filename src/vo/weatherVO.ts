import { ApiProperty } from '@midwayjs/swagger';

export class WeatherVO {
  /**
   * @description 城市ID
   */
  @ApiProperty({
    description: '城市ID',
  })
  cityId: string;
  /**
   * @description 城市名称
   */
  @ApiProperty({
    description: '城市名称',
  })
  cityName: string;
  /**
   * @description 天气
   */
  @ApiProperty({
    description: '天气',
  })
  weather: string;
  /**
   * @description 温度
   */
  @ApiProperty({
    description: '温度',
  })
  temperature: string;
  /**
   * @description 湿度
   */
  @ApiProperty({
    description: '湿度',
  })
  humidity: string;
  /**
   * @description 风速
   */
  @ApiProperty({
    description: '风速',
  })
  windSpeed: string;
  /**
   * @description 天气图标
   */
  @ApiProperty({
    description: '天气图标',
  })
  weatherIcon: string;
}
