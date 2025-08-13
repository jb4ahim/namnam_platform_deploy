import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository'; // NEW: Added import
// import { TwilioModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { JwtStrategyWithConfig } from '@app/auth';

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
    // TwilioModule,
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