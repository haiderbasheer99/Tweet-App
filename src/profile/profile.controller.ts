import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}

    @Get()
    public getProfile(@ActiveUser('sub') userId: number){
        return this.profileService.getYourProfile(userId);
    }

}
