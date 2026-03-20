import { PrismaService } from '@app/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveOtpPhone(countryCode: string, phoneNumber: string, otp: string) {
    return this.prisma.user_otp.create({
      data: {
        destination: countryCode + phoneNumber,
        method: 'phone',
        otp_code: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async verifyOtp(destination: string, code: string): Promise<boolean> {
    const otpRecord = await this.prisma.user_otp.findFirst({
      where: {
        destination,
        method: 'phone',
        otp_code: code,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!otpRecord) return false;

    await this.prisma.user_otp.update({
      where: { user_otp_id: otpRecord.user_otp_id },
      data: { is_used: true },
    });

    return true;
  }

  async createWithPhone(phone: string) {
    const user = await this.prisma.users.create({
      data: {
        phone_number: phone,
        user_type: 'customer',
      },
    });
    return user.user_id;
  }
}
