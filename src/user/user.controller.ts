import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth('JWT-auth') //for marking the route with swagger auth  documentaion
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({
    status: 200,
    description: 'it will return all Users in the Response',
  })
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getAll(paginationDto);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update Current User Profile' })
  @ApiResponse({
    status: 200,
    description: 'it will return the Updated User Profile in the Response',
  })
  public UpdateUserProfile(
    @Body() profile: UpdateProfileDto,
    @ActiveUser('sub') userId: number,
  ) {
    return this.userService.updateUserProfile(profile, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User by id' })
  @ApiResponse({
    status: 200,
    description: 'it will Delete User by id in the Response',
  })
  getUser(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.userService.deleteUser(id, userId);
  }
}
