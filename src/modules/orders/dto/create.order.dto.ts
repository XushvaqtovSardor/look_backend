import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class createOrderDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    foodId: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    count: number
}