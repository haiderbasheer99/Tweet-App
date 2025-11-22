import { IsDate, IsOptional, IsString, MaxLength, MinLength, } from "class-validator"
export class CreateProfileDto{

    @IsString({message: 'firstName Must be a String Value..'})
    @IsOptional()
    @MinLength(3, {message: 'firstName Must have a minimum of 3 characters..'})
    @MaxLength(100, {message: 'firstName Must have a maxmum of 100 characters..'})
    firstName?: string;

    @IsString({message: 'lastName Must be a String Value..'})
    @IsOptional()
    @MinLength(3, {message: 'firstName Must have a minimum of 3 characters..'})
    @MaxLength(100, {message: 'firstName Must have a maxmum of 3 characters..'})
    lastName?: string;

    @IsString({message: 'Gender should be String Value'})
    @IsOptional()
    @MaxLength(10, {message: 'Gender Must have a maxmum of 10 characters..'})
    gender?: string;

    @IsOptional()
    @IsDate({message: 'DateOfBirth should be Date'})
    dateOfBirth?: Date;

    @IsString({message: 'Bio should be String'})
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profileImage?: string

}