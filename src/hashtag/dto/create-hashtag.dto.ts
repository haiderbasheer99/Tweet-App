import { IsNotEmpty, IsNumber, IsString } from "class-validator";
// import { Unique } from "typeorm";

export class CreateHashtagDto{
    @IsNotEmpty()
    @IsString()
    // @Unique
    text: string

    // @IsNotEmpty()
    // @IsNumber()
    // userId: number
}