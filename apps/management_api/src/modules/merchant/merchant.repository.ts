import { Injectable } from '@nestjs/common';
import { PrismaService, merchant_request_status } from '@app/database';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginatedResultDto, PaginationQueryDto } from '@app/common/dto';
import { GetMerchantDto } from './dto/get-merchants.dto';

@Injectable()
export class MerchantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMerchants(limit = 50, offset = 0) {
    return this.prisma.merchants.findMany({
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
    });
  }

  async getMerchantById(merchantId: number) {
    return this.prisma.merchants.findUnique({
      where: { merchant_id: merchantId },
    });
  }

  async getMerchantTokenByUserId(merchantId: number) {
    const merchantUser = await this.prisma.merchant_users.findFirst({
      where: { merchant_id: merchantId },
      select: {
        fcm_token: true,
        users: { select: { email: true } },
      },
    });
    if (!merchantUser) return null;
    return { fcmToken: merchantUser.fcm_token, email: merchantUser.users?.email };
  }

  async getMerchants(
    pagination: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResultDto<GetMerchantDto>> {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [rows, totalCount] = await this.prisma.$transaction([
      this.prisma.merchants.findMany({
        where,
        take: pageSize,
        skip,
        orderBy: { created_at: 'desc' },
        select: {
          merchant_id: true,
          name: true,
          description: true,
          is_owned_by_app: true,
          created_at: true,
          logo_key: true,
        },
      }),
      this.prisma.merchants.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items: rows.map(m => ({
        id: m.merchant_id,
        name: m.name,
        description: m.description,
        isOwnedByApp: m.is_owned_by_app,
        joinedAt: m.created_at?.toISOString(),
        logoKey: m.logo_key,
      })) as unknown as GetMerchantDto[],
      totalCount,
      totalPages,
      pageSize,
      page,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async deleteMerchant(merchantId: number) {
    return this.prisma.merchants.delete({
      where: { merchant_id: merchantId },
    });
  }

  async approveMerchant(merchantId: number) {
    await this.prisma.merchants.update({
      where: { merchant_id: merchantId },
      data: { is_active: true },
    });

    await this.prisma.merchant_requests.updateMany({
      where: { merchant_id: merchantId, status: 'pending' },
      data: { status: 'approved' },
    });

    const merchantUser = await this.prisma.merchant_users.findFirst({
      where: { merchant_id: merchantId },
      select: { users: { select: { email: true } } },
    });

    return { email: merchantUser?.users?.email ?? null };
  }

  async suspendMerchant(merchantId: number, reason?: string) {
    await this.prisma.merchants.update({
      where: { merchant_id: merchantId },
      data: { is_active: false },
    });

    return { success: true, reason: reason ?? null };
  }

  async getMerchantDetailedInfo(merchantId: number) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { merchant_id: merchantId },
      select: {
        merchant_id: true,
        name: true,
        description: true,
        hotline_number: true,
        logo_key: true,
        cover_key: true,
        latitude: true,
        longitude: true,
        created_at: true,
        is_owned_by_app: true,
        categories: {
          select: {
            category_id: true,
            name: true,
            image_key: true,
          },
        },
      },
    });

    if (!merchant) return null;

    return {
      merchantId: merchant.merchant_id,
      name: merchant.name,
      description: merchant.description,
      hotline: merchant.hotline_number,
      logoKey: merchant.logo_key,
      coverKey: merchant.cover_key,
      latitude: merchant.latitude,
      longitude: merchant.longitude,
      createdAt: merchant.created_at?.toISOString(),
      isOwnedByApp: merchant.is_owned_by_app,
      category: merchant.categories
        ? {
            categoryId: merchant.categories.category_id,
            categoryName: merchant.categories.name,
            categoryIcon: merchant.categories.image_key,
          }
        : null,
    };
  }

  async getWeeklySchedule(merchantId: number) {
    const rows = await this.prisma.merchant_hours.findMany({
      where: { merchant_id: merchantId },
      select: {
        merchant_hour_id: true,
        day_of_week: true,
        open_time: true,
        close_time: true,
        is_closed: true,
      },
      orderBy: { merchant_hour_id: 'asc' },
    });

    return rows.map(r => ({
      scheduleId: r.merchant_hour_id,
      dayOfWeek: r.day_of_week,
      openTime: r.open_time?.toISOString().substring(11, 19) ?? null,
      closeTime: r.close_time?.toISOString().substring(11, 19) ?? null,
      isClosed: r.is_closed,
    }));
  }

  async getContactPersons(merchantId: number) {
    const rows = await this.prisma.merchant_contact_persons.findMany({
      where: { merchant_id: merchantId },
      select: {
        merchant_contact_person_id: true,
        first_name: true,
        last_name: true,
        role: true,
        email_address: true,
        phone_number: true,
      },
    });

    return rows.map(r => ({
      contactPersonId: r.merchant_contact_person_id,
      firstName: r.first_name,
      lastName: r.last_name,
      role: r.role,
      emailAddress: r.email_address,
      phoneNumber: r.phone_number,
    }));
  }

  async getLocation(merchantId: number) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { merchant_id: merchantId },
      select: {
        latitude: true,
        longitude: true,
        street: true,
        building: true,
        notes: true,
        merchant_images: {
          select: { images: { select: { file_key: true } } },
        },
      },
    });

    if (!merchant) return null;

    return {
      latitude: merchant.latitude,
      longitude: merchant.longitude,
      street: merchant.street,
      building: merchant.building,
      notes: merchant.notes,
      buildingImages: merchant.merchant_images.map(mi => mi.images.file_key),
    };
  }

  async getCatalog(merchantId?: number) {
    const sections = await this.prisma.catalog_sections.findMany({
      where: { merchant_id: merchantId, is_deleted: false, is_disabled: false },
      orderBy: { display_order: 'asc' },
      select: {
        section_id: true,
        section_title_en: true,
        section_title_ar: true,
        display_order: true,
        products: {
          where: { is_deleted: false, is_disabled: false },
          orderBy: { display_order: 'asc' },
          select: {
            product_id: true,
            name: true,
            name_ar: true,
            description: true,
            price: true,
            sale_price: true,
            is_on_sale: true,
            is_available: true,
            image_url: true,
          },
        },
      },
    });

    return sections;
  }

  async getCatalogProductsBySection(merchantId?: number, sectionId?: number) {
    return this.prisma.catalog_sections.findFirst({
      where: { merchant_id: merchantId, section_id: sectionId, is_deleted: false },
      select: {
        section_id: true,
        section_title_en: true,
        section_title_ar: true,
        products: {
          where: { is_deleted: false, is_disabled: false },
          orderBy: { display_order: 'asc' },
        },
      },
    });
  }

  async getMerchantRequests(status: string = 'pending') {
    const requests = await this.prisma.merchant_requests.findMany({
      where: { status: status as merchant_request_status },
      orderBy: { created_at: 'desc' },
      select: {
        merchant_request_id: true,
        status: true,
        created_at: true,
        merchants: {
          select: {
            merchant_id: true,
            name: true,
            description: true,
            is_owned_by_app: true,
            created_at: true,
            logo_key: true,
            cover_key: true,
            hotline_number: true,
            latitude: true,
            longitude: true,
            street: true,
            building: true,
            notes: true,
            zone_id: true,
            categories: {
              select: {
                category_id: true,
                name: true,
                image_key: true,
              },
            },
          },
        },
      },
    });

    return requests.map(r => ({
      requestId: r.merchant_request_id,
      status: r.status,
      requestCreatedAt: r.created_at?.toISOString(),
      merchant: {
        merchantId: r.merchants.merchant_id,
        name: r.merchants.name,
        description: r.merchants.description,
        isOwnedByApp: r.merchants.is_owned_by_app,
        merchantCreatedAt: r.merchants.created_at?.toISOString(),
        notes: r.merchants.notes,
        zoneId: r.merchants.zone_id,
        category: r.merchants.categories
          ? {
              categoryId: r.merchants.categories.category_id,
              categoryName: r.merchants.categories.name,
              categoryIcon: r.merchants.categories.image_key,
            }
          : null,
        media: {
          logoKey: r.merchants.logo_key,
          coverKey: r.merchants.cover_key,
        },
        contact: {
          hotlineNumber: r.merchants.hotline_number,
        },
        location: {
          latitude: r.merchants.latitude,
          longitude: r.merchants.longitude,
          street: r.merchants.street,
          building: r.merchants.building,
        },
      },
    }));
  }

  async updateMerchantStatus(merchantId: number, status: string, zoneId: number) {
    await this.prisma.merchant_requests.updateMany({
      where: { merchant_id: merchantId },
      data: { status: status as merchant_request_status },
    });

    if (zoneId) {
      await this.prisma.merchants.update({
        where: { merchant_id: merchantId },
        data: { zone_id: zoneId },
      });
    }

    return { success: true };
  }
}
