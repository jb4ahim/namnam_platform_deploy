import { IsArray, ValidateNested, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

    export class BulkUpdateItemDto {
        @ApiProperty({ description: 'ID of the cart item to update', example: 15 })
        @IsNumber()
        cart_item_id: number;

        @ApiProperty({ description: 'New quantity for the item', example: 2 })
        @IsInt()
        @Min(1)
        quantity: number;
    }

    export class BulkUpdateItemsDto {
        @ApiProperty({ type: [BulkUpdateItemDto], description: 'List of items to update' })
        @IsArray()
        @ValidateNested({ each: true })
        @Type(() => BulkUpdateItemDto)
        items: BulkUpdateItemDto[];
    }
