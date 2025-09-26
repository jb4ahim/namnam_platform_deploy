import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class CatalogRepository {
  constructor(private readonly pg: PostgresService) {}

  // Section methods
  async getSections(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_catalog_sections',
      [merchantId]
      
    );
    return result;
  }

  async createSection(sectionDto: CreateSectionDto, merchantId: number) {
    console.log('Creating section for merchantId:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_catalog_section',
      [
        merchantId,
        sectionDto.sectionTitleEnglish,
        sectionDto.sectionTitleArabic,
        null
      ]
    );
    console.log('createSection result:', result);
    return result;
  }

  async updateSection(sectionId: number, sectionDto: UpdateSectionDto, merchantId: number): Promise<void> {
    console.log('Updating section for merchantId:', merchantId, 'sectionId:', sectionId);
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_merchant_section',
      [
        sectionId,
        merchantId,
        sectionDto.sectionTitleArabic || null,
        sectionDto.sectionTitleEnglish || null
      ]
    );
  }
}
