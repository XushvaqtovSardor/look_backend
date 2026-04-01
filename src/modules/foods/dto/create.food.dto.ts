import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  food_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  food_img: string;
}
