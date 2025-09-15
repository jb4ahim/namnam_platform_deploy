import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { MerchantService } from "./merchant.service";
import { AuthGuard } from "@app/auth";

@Controller("merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}


  @Get()
  @UseGuards(AuthGuard)
  async getMerchants(
    @Query("q") searchTerm?: string,
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("offset", ParseIntPipe) offset?: number
  ) {
    return await this.merchantService.getMerchants(searchTerm, limit, offset);
  }




  @Get(":id/info")
  @UseGuards(AuthGuard)
  async getMerchantInfo(@Param("id", ParseIntPipe) merchantId: number) {
    console.log('Fetching merchant info for merchantId:', merchantId);
    return await this.merchantService.getMerchantDetailedInfo(merchantId);
  }

  @Get(":id/schedules")
  @UseGuards(AuthGuard)
  async getWeeklySchedule(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getWeeklySchedule(merchantId);
  }

  @Get(":id/contact-persons")
  @UseGuards(AuthGuard)
  async getContactPersons(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getContactPersons(merchantId);
  }

  @Get(":id/location")
  @UseGuards(AuthGuard)
  async getLocation(@Param("id", ParseIntPipe) merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }


  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.deleteMerchant(id);
  }

  @Post(":id/approve")
  @UseGuards(AuthGuard)
  async approveMerchant(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.approveMerchant(id);
  }

  @Get(":id/catalog")
  @UseGuards(AuthGuard)
  async getCatalog(@Param("id", ParseIntPipe) id: number) {
    return await this.merchantService.getCatalog(id);
  }
  
  @Post(":id/suspend")
  @UseGuards(AuthGuard)
  async suspendMerchant(
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason?: string
  ) {
    return await this.merchantService.suspendMerchant(id, reason);
  }
}
