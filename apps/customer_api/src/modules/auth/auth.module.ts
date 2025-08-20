import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
// import { TwilioModule } from '@app/common';
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
    // TwilioModule,
  forwardRef(() => UsersModule),
    DatabaseModule
  ],
  providers: [
    AuthService,
    AuthRepository
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
