import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategyWithConfig } from '@namnam/auth/jwt.strategy';
import { TwilioModule, TwilioSmsService } from '@namnam/common/twillio';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
    TwilioModule,
    UsersModule
  ],
  providers: [
    AuthService,
    JwtStrategyWithConfig
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
