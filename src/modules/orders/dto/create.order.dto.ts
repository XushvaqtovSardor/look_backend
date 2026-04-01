import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
// import { NotEmpty } from "sequelize-typescript";

export class createOrderDto{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId:number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    foodId:number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    count:number
}