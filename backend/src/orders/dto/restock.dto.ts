import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RestockDto {
  @IsInt()
  @Min(1)
  quantityUnits: number;

  @IsString()
  @IsOptional()
  note?: string;
}
