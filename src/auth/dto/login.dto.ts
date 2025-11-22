import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto{

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    @IsOptional()
    @IsString({ message: 'OTP must be a string' })
    otp?: string;
}