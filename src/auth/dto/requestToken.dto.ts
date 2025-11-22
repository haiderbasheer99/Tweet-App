import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RequestTokenDto{

    @IsNotEmpty({message: 'Email Should Not Be Empty'})
    @IsEmail()
    @IsString({message: 'Email Must Be String Value'})
    email: string;
}