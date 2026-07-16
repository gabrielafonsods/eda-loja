import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitType } from '../entities/product-variant.entity';

export class CreateProductVariantDto {
  @IsEnum(UnitType)
  unitType: UnitType;

  @IsInt()
  @Min(1)
  quantityPerUnit: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStock?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  // Ex: { "Cor": "Azul", "Número": "5", "Sabor": "Menta" }
  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
