// dpop.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class DPoPGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dpopProof = request.headers['dpop'];
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!dpopProof || !accessToken) {
      throw new UnauthorizedException('Missing DPoP or Access Token');
    }

    const isValid = await verifyDpopProof(dpopProof, accessToken, request);
    if (!isValid) {
      throw new UnauthorizedException('Invalid DPoP proof');
    }
    return true;
  }
}
