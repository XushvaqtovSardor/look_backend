import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone : string
}