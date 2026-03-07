import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MerchantInfoResponseDto } from '../../merchant/dto/merchant-response.dto';

export class VerifyOtpResponseDto {
  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: false, description: 'True if the merchant already has an account' })
  isRegistered: boolean;

  @ApiProperty({ example: 'a3f2b1c4-...' , description: 'Token required for the register/login step' })
  verifyToken: string;

  @ApiPropertyOptional({ example: '2025-01-01T10:15:00.000Z', description: 'Only present when isRegistered is true' })
  expiresAt?: string;
}

export class AuthTokensResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 5 })
  merchantId: number;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ type: [Object], description: 'Onboarding steps completion status' })
  steps: Pick<InstanceType<typeof MerchantInfoResponseDto>, 'steps'>['steps'];

  @ApiProperty({ example: 'User registered successfully' })
  message: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
