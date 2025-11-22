import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTweetDto{

    @IsNotEmpty({ message: 'Text is required' })
    @IsString({ message: 'Text must be a string' })
    text: string;

    @IsOptional()
    image: string;

    @IsOptional()
    @IsArray()
    @IsInt({each: true})
    hashtags?: number[]

}