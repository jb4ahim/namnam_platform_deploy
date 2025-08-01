import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategyWithConfig } from '@namnam/auth/jwt.strategy';
import { TwilioSmsService } from '@namnam/common/twillio';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
    TwilioSmsService
  ],
  providers: [
    AuthService,
    JwtStrategyWithConfig
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
