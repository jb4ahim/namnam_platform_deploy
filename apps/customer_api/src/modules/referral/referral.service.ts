import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';

const VOUCHER_AMOUNT = 10;
const VOUCHER_VALIDITY_DAYS = 30;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateCodeForCustomer(customerId: number): Promise<string> {
    let code: string;
    let attempts = 0;

    do {
      code = Array.from(
        { length: 8 },
        () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      ).join('');
      attempts++;
    } while (
      attempts < 10 &&
      (await this.prisma.referral_codes.findUnique({ where: { code } }))
    );

    await this.prisma.referral_codes.create({
      data: { code, customer_id: customerId },
    });

    return code;
  }

  async applyReferralCode(code: string, newCustomerId: number): Promise<void> {
    const referralCode = await this.prisma.referral_codes.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!referralCode) throw new BadRequestException('Invalid referral code');

    if (referralCode.customer_id === newCustomerId) {
      throw new BadRequestException('You cannot use your own referral code');
    }

    await this.prisma.referral_uses.create({
      data: {
        referral_code_id: referralCode.referral_code_id,
        referred_customer_id: newCustomerId,
      },
    });
  }

  async handleFirstOrder(customerId: number): Promise<void> {
    const use = await this.prisma.referral_uses.findUnique({
      where: { referred_customer_id: customerId },
      include: { referral_codes: true },
    });

    if (!use || use.first_order_placed) return;

    await this.prisma.referral_uses.update({
      where: { referral_use_id: use.referral_use_id },
      data: { first_order_placed: true },
    });

    try {
      const coupon = await this.issueVoucherToReferrer(use.referral_codes.customer_id);
      await this.prisma.referral_uses.update({
        where: { referral_use_id: use.referral_use_id },
        data: { voucher_issued: true, voucher_coupon_id: coupon.coupon_id },
      });
    } catch (error) {
      this.logger.error(`Failed to issue referral voucher for customer ${customerId}`, error);
    }
  }

  private async issueVoucherToReferrer(referrerCustomerId: number) {
    const code = `REF-${referrerCustomerId}-${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + VOUCHER_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

    return this.prisma.coupons.create({
      data: {
        code,
        name: 'Referral Reward',
        description: `Earned by referring a friend`,
        discount_type: 'fixed_amount',
        discount_value: VOUCHER_AMOUNT,
        applicable_merchant_ids: [],
        applicable_product_ids: [],
        starts_at: now,
        ends_at: expiresAt,
        is_active: true,
        max_redemptions: 1,
        per_user_limit: 1,
      },
    });
  }
}
