import { IsArray, ValidateNested, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

    export class BulkUpdateItemDto {
        @IsNumber()
        cart_item_id: number;

        @IsInt()
        @Min(1)
        quantity: number;
    }

    export class BulkUpdateItemsDto {
        @IsArray()
        @ValidateNested({ each: true })
        @Type(() => BulkUpdateItemDto)
        items: BulkUpdateItemDto[];
    }
