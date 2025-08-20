// libs/jwt/src/jwt.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { JwtConfig } from './jwt.config';

@Global() // Makes the module available globally without importing
@Module({
  imports: [ConfigModule],
  providers: [JwtService, JwtConfig],
  exports: [JwtService, JwtConfig]
})
export class JwtModule {
  static forRoot() {
    return {
      module: JwtModule,
      global: true,
    };
  }
}