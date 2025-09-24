import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentMerchantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request.user:', request.user);
    // Adjust this path according to your user object structure
    return request.user?.merchantId;
  },
);
