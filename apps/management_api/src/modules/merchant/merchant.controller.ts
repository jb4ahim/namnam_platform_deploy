import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantService } from "./merchant.service";
import { AuthGuard } from "@app/auth";

@ApiTags('Merchants')
@ApiBearerAuth()
@Controller("merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}


  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all merchants' })
  async getMerchants(
    @Query("q") searchTerm?: string,
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("offset", ParseIntPipe) offset?: number
  ) {
    return await this.merchantService.getMerchants(searchTerm, limit, offset);
  }




  @Get(":id/info")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant detailed info' })
  async getMerchantInfo(@Param("id", ParseIntPipe) merchantId: number) {
    console.log('Fetching merchant info for merchantId:', merchantId);
    return await this.merchantService.getMerchantDetailedInfo(merchantId);
  }

  @Get(":id/schedules")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant weekly schedule' })
  async getWeeklySchedule(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getWeeklySchedule(merchantId);
  }

  @Get(":id/contact-persons")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant contact persons' })
  async getContactPersons(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getContactPersons(merchantId);
  }

  @Get(":id/location")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant location' })
  async getLocation(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }


  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a merchant' })
  async deleteMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.deleteMerchant(id);
  }

  @Post(":id/approve")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Approve a merchant' })
  async approveMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.approveMerchant(id);
  }

  @Get(":id/catalog")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a merchant catalog' })
  async getCatalog(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.getCatalog(id);
  }

  @Get(":id/catalog/sections/:sectionId/products")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get catalog products by section ID' })
  async getCatalogProductsBySection(
    @Param("id", ParseIntPipe) id: number,
    @Param("sectionId", ParseIntPipe) sectionId: number
  ) {
    return await this.merchantService.getCatalogProductsBySection(id, sectionId);
  }

  @Post(":id/suspend")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Suspend a merchant' })
  async suspendMerchant(
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason?: string
  ) {
    return await this.merchantService.suspendMerchant(id, reason);
  }

  @Get("merchant-requests")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get merchant requests' })
  async getMerchantRequests() {
    return await this.merchantService.getMerchantRequests();
  }

  @Patch("/:id/status")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update merchant status' })
  async updateMerchantStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string,
    @Body("zoneId", ParseIntPipe) zoneId: number
  ) {
    return await this.merchantService.updateMerchantStatus(id, status, zoneId);
  }
}