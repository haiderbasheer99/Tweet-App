import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';
import { In, Repository } from 'typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Tweet } from 'src/tweet/tweet.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class HashtagService {
    constructor(
        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>,

        private readonly userService: UserService
    ) { }

    public async getAllHashtags(userId: number) {
        try {
            let existHashtag = await this.hashtagRepository.findOne({ where: { user: { id: userId } } })

            if (!existHashtag) {
                throw new BadRequestException('Bad request for this hashtag')
            }
            let allHashtag = await this.hashtagRepository.find({where: {
                user: {id: userId}
            }});
            return allHashtag;

        } catch (error) {
            throw new NotFoundException(error.response, 'There are no Hashtags For This User')
        }

    }

    public async getHashtag(hashtags: number[], userId: number) {
        try {
            let checkUser = await this.hashtagRepository.findOne({ where: { user: { id: userId } } })
            if(!checkUser){
                throw new UnauthorizedException('You cant Get Hashtags bcs you are not Allowed')
            }
            const hashtag = await this.hashtagRepository.find(
                {
                    where: { id: In(hashtags),
                             user: {id: userId}
                     },
                    // relations: ['tweets']
                });
            return hashtag

        } catch (error) {
            throw new UnauthorizedException('You cant Get Hashtags bcs you are not Allowed')
        }

    }

    public async createHashtag(createHashtagDto: CreateHashtagDto, userId: number) {

        try {
            let user = await this.userService.findUserById(userId);
            if (!user) {
                throw new NotFoundException(`No User with id ${userId} was Found`)
            }
            let oldHashtag = await this.hashtagRepository.findOne({
                where: {
                    text: createHashtagDto.text
                }
            })
            if (oldHashtag) {
                throw new BadRequestException('there is duplicate hashtag');
            }

            let hashtag = this.hashtagRepository.create({ ...createHashtagDto, user });
            let newHashtag = await this.hashtagRepository.save(hashtag)
            const { password, ...safeUser } = newHashtag.user
            return { ...newHashtag, user: safeUser }
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            };
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new UnauthorizedException('ERROR')

        }

    }

    public async deleteHashtag(id: number, userId: number) {
        try {
            const user = await this.userService.findUserById(userId);
            if (!user) {
                throw new NotFoundException(`User with id ${userId} was not found`);
            }

            const hahstag = await this.hashtagRepository.findOne({
                where: { id },
                relations: ['user']
            })
            if (!hahstag) {
                throw new NotFoundException(`No hashtag with id ${id} was found`)
            }

            if (hahstag.user.id !== userId) {
                throw new UnauthorizedException('You Are Not Authorized To Delete This Hashtag');
            }
            return await this.hashtagRepository.delete({ id });

        } catch (error) {
            throw error;
        }

    }


}
