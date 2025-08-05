// import { Injectable } from '@nestjs/common';
// import { PostgresService } from '@namnam/database';
// import { CreateContactPersonDto } from './dto/create-contact-person.dto';
// import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
// import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';

// @Injectable()
// export class MerchantRepository {
//   constructor(private readonly pg: PostgresService) {}



//   // New methods for merchant APIs
//   async createContactPerson(contactPersonDto: CreateContactPersonDto) {
//     const query = `CALL insert_contact_person($1, $2, $3, $4, $5, $6, $7);`;
//     const rows = await this.pg.query(query, [
//       contactPersonDto.merchant_id,
//       contactPersonDto.contact_id || null,
//       contactPersonDto.first_name,
//       contactPersonDto.last_name,
//       contactPersonDto.role,
//       contactPersonDto.phone,
//       contactPersonDto.email
//     ]);
//     console.log('createContactPerson', rows);
//     return rows[0] || null;
//   }

//   async createMerchantInfo(merchantInfoDto: CreateMerchantInfoDto) {
//     const query = `CALL insert_merchant_info($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`;
//     const rows = await this.pg.query(query, [
//       merchantInfoDto.merchant_id,
//       merchantInfoDto.name,
//       merchantInfoDto.description,
//       merchantInfoDto.hotline,
//       merchantInfoDto.logo_url,
//       merchantInfoDto.cover_url,
//       merchantInfoDto.location.latitude,
//       merchantInfoDto.location.longitude,
//       merchantInfoDto.location.city_id,
//       merchantInfoDto.location.country_id,
//       merchantInfoDto.location.street,
//       merchantInfoDto.location.address_description,
//       merchantInfoDto.app_section_id,
//       merchantInfoDto.cuisine_type_ids || null,
//       merchantInfoDto.shop_type_ids || null
//     ]);
//     console.log('createMerchantInfo', rows);
//     return rows[0] || null;
//   }

//   async createWeeklySchedule(scheduleDto: CreateWeeklyScheduleDto) {
//     const query = `CALL insert_weekly_schedule($1, $2);`;
//     const rows = await this.pg.query(query, [
//       scheduleDto.merchant_id,
//       JSON.stringify(scheduleDto.weeklySchedule)
//     ]);
//     console.log('createWeeklySchedule', rows);
//     return rows[0] || null;
//   }

//   // Alternative method if you prefer to insert each day separately
//   async createWeeklyScheduleSeparate(scheduleDto: CreateWeeklyScheduleDto) {
//     const results = [];
//     for (const daySchedule of scheduleDto.weeklySchedule) {
//       const query = `CALL insert_day_schedule($1, $2, $3, $4, $5);`;
//       const rows = await this.pg.query(query, [
//         scheduleDto.merchant_id,
//         daySchedule.day,
//         daySchedule.is_open,
//         daySchedule.open || null,
//         daySchedule.close || null
//       ]);
//       results.push(rows[0]);
//     }
//     console.log('createWeeklyScheduleSeparate', results);
//     return results;
//   }
// }