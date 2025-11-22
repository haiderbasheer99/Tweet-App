import { IsInt, IsNotEmpty } from "class-validator";
import { CreateProfileDto } from "./create-profile.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateProfileDto extends PartialType(CreateProfileDto){
    @IsNotEmpty()
    @IsInt()
    id: number;
}