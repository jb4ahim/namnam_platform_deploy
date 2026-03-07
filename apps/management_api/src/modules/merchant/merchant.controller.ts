import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query, UseGuards, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MerchantService } from "./merchant.service";
import { AuthGuard } from "@app/auth";
import {
  PaginatedMerchantsDto,
  MerchantDetailedInfoDto,
  MerchantScheduleItemDto,
  MerchantLocationDto,
  MerchantRequestDto,
} from './dto/merchant-response.dto';

@ApiTags('Merchants')
@ApiBearerAuth()
@Controller("merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all merchants (paginated)' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search by name or phone' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size (default 20)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, type: PaginatedMerchantsDto, description: 'Paginated list of merchants' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMerchants(
    @Query("q") searchTerm?: string,
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("offset", ParseIntPipe) offset?: number
  ) {
    return await this.merchantService.getMerchants(searchTerm, limit, offset);
  }

  @Get("merchant-requests")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all merchant approval requests' })
  @ApiResponse({ status: 200, type: [MerchantRequestDto], description: 'List of pending and resolved merchant requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMerchantRequests() {
    return await this.merchantService.getMerchantRequests();
  }

  @Get(":id/info")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant detailed info' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: MerchantDetailedInfoDto, description: 'Merchant info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  async getMerchantInfo(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getMerchantDetailedInfo(merchantId);
  }

  @Get(":id/schedules")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant weekly schedule' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: [MerchantScheduleItemDto], description: 'Weekly schedule' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWeeklySchedule(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getWeeklySchedule(merchantId);
  }

  @Get(":id/contact-persons")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant contact persons' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Contact person details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getContactPersons(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getContactPersons(merchantId);
  }

  @Get(":id/location")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: MerchantLocationDto, description: 'Merchant location' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLocation(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }

  @Get(":id/catalog")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant catalog sections' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Catalog sections with product count' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCatalog(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.getCatalog(id);
  }

  @Get(":id/catalog/sections/:sectionId/products")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get catalog products by section' })
  @ApiParam({ name: 'id', type: Number, description: 'Merchant ID' })
  @ApiParam({ name: 'sectionId', type: Number, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Products in the section' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCatalogProductsBySection(
    @Param("id", ParseIntPipe) id: number,
    @Param("sectionId", ParseIntPipe) sectionId: number
  ) {
    return await this.merchantService.getCatalogProductsBySection(id, sectionId);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a merchant' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Merchant deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  async deleteMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.deleteMerchant(id);
  }

  @Post(":id/approve")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Approve a merchant' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 201, description: 'Merchant approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async approveMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.approveMerchant(id);
  }

  @Post(":id/suspend")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Suspend a merchant' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string', example: 'Policy violation' } } } })
  @ApiResponse({ status: 201, description: 'Merchant suspended' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async suspendMerchant(
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason?: string
  ) {
    return await this.merchantService.suspendMerchant(id, reason);
  }

  @Patch("/:id/status")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update merchant status and assign zone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', example: 'approved' }, zoneId: { type: 'number', example: 5 } } } })
  @ApiResponse({ status: 200, description: 'Merchant status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMerchantStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string,
    @Body("zoneId", ParseIntPipe) zoneId: number
  ) {
    return await this.merchantService.updateMerchantStatus(id, status, zoneId);
  }
}
