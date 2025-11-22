import { Body, Controller, Delete, Get, Param,  ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get()
    getAllUsers(@Query() paginationDto: PaginationDto){
       return this.userService.getAll(paginationDto);
    };

    @Patch('update-profile')
    public UpdateUserProfile(
        @Body() profile: UpdateProfileDto,
        @ActiveUser('sub') userId: number
    ){
        return this.userService.updateUserProfile(profile, userId);
    }

    @Delete(':id')
    getUser(@Param('id', ParseIntPipe) id: number,
     @ActiveUser('sub') userId: number){
        return this.userService.deleteUser(id, userId);
    }

}
