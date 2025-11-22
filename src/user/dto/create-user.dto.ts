import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, } from "class-validator"
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";

export class CreateUserDto{

    @IsString({ message: 'UserName must be a string' })
    @IsNotEmpty({ message: 'UserName should not be empty' })
    @MinLength(7, {message: 'Min Length For UserName Is 7 Characters'})
    @MaxLength(24, { message: 'Max length for UserName is 24 characters' })
    // @Matches(/^[A-Za-z0-9_]+$/, { message: 'UserName can only contain letters, numbers and underscores' })
    userName: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email field should not be empty' })
    @MaxLength(100, { message: 'Max length for email is 100 characters' })
    email: string;

    @IsString({message: 'Password Must Be a String Value'})
    @IsNotEmpty({message: 'Password Should Not Be Empty'})
    @MinLength(8, {message: 'Min Length For Password Is 8 Character'})
    @MaxLength(100, {message: 'Max Length For Password Is 100 Character'})
    password: string;
    
    @IsOptional()
    profile: CreateProfileDto
}