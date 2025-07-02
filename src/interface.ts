export interface WeatherInfo {
  weatherinfo: {
    city: string;
    cityid: string;
    temp: string;
    WD: string;
    WS: string;
    SD: string;
    AP: string;
    njd: string;
    WSE: string;
    time: string;
    sm: string;
    isRadar: string;
    Radar: string;
  };
}

/**
 * @description 响应接口
 * @author lunjingjie
 * @date 2025-07-02
 */
export interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
}
