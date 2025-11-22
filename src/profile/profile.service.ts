import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,

        private readonly userService: UserService

    ) { }

    public async getYourProfile(userId: number) {
        try {
            let profile = await this.profileRepository.findOne({
                where: {
                    user: {
                        id: userId
                    }
                },
                relations: ['user']
            });

            if (!profile) {
                throw new UnauthorizedException('You Are Not AUTHERIZED to get this Profile')
            }
            const { user, ...result } = profile;
            const { password, ...safeUser } = user;

            return {
                result,
                user: safeUser
            }
        } catch (error) {
            if (error.statuscode === '401') {
                throw new UnauthorizedException(error.response)
            }
            throw new BadRequestException(error.response)
        }

    }

}
