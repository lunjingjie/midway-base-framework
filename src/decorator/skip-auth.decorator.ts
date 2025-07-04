/**
 * 跳过授权验证的装饰器
 * 可以应用于控制器类或方法
 */
export function SkipAuth(): ClassDecorator & MethodDecorator {
  return (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (key) {
      // 应用于方法
      Reflect.defineMetadata('skipAuth', true, target, key);
    } else {
      // 应用于类
      Reflect.defineMetadata('skipAuth', true, target);
    }
    return descriptor;
  };
}
