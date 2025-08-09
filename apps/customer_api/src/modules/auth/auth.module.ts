import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TwilioModule } from 'nest generate library auth/common/twillio';
import { JwtStrategyWithConfig } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { AuthRepository } from './auth.repository';

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
    UsersModule,
    DatabaseModule
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategyWithConfig
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
