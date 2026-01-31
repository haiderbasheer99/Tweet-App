import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get Current User Profile ' })
  @ApiResponse({
    status: 200,
    description: 'it will Return Current User Profile Response',
  })
  @ApiBearerAuth('JWT-auth') //for marking the route with swagger auth  documentaion
  public getProfile(@ActiveUser('sub') userId: number) {
    return this.profileService.getYourProfile(userId);
  }
}
