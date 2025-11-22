import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Hashtag } from 'src/hashtag/hashtag.entity';
import { TweetHelpersService } from 'src/tweet-helpers/tweet-helpers.service';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UserService,
        private readonly hashtagService: HashtagService,
        private readonly tweetHelper: TweetHelpersService,

        @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
        private readonly paginationProvider: PaginationProvider
    ) { }

    public async getAllTweets(userId: number, paginationQueryDto: PaginationDto) {
        try {
            const user = await this.userService.findUserById(userId)
            if (!user) {
                throw new NotFoundException(`no user with id ${userId} was not found`)
            }

            return await this.paginationProvider.paginateQuery(
                paginationQueryDto,
                this.tweetRepository,
                { user: { id: userId } },
                ['hashtags']
            )

        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('An Error has occured, please try again later', {
                    description: 'Could connect to the Database...'
                });
            }
            throw new NotFoundException(error.response);
        }
    }

    public async createTweet(createTweetDto: CreateTweetDto, userId: number) {
        try {
            let { user, hashtags } = await this.tweetHelper.fetchUserAndHashtags(
                createTweetDto,
                userId,
            );

            //create aTweet
            return this.tweetHelper.saveTweet(createTweetDto, user, hashtags);
        } catch (error) {
            throw new BadRequestException(error, 'Cant Create Tweet Please Check Your Request')
        }


    }

    public async updateTweet(updateTweetDto: UpdateTweetDto, userId: number) {

        try {
            const user = await this.userService.findUserById(userId);
            if (!user) {
                throw new NotFoundException(`User with id ${userId} was not found`);
            }

            let tweet = await this.tweetRepository.findOne({
                where: { id: updateTweetDto.id },
                relations: ['user', 'hashtags'],
            });

            if (!tweet) {
                throw new NotFoundException(`Tweet with id ${updateTweetDto.id} was not found`);
            }

            // ensure the active user is the creator of the tweet
            if (tweet.user.id !== user.id) {
                throw new UnauthorizedException('You are not allowed to update this tweet');
            }

            //this will check if there hashtags in the dto or it will replace the old hashtags
            const fetchedHashtags = updateTweetDto.hashtags && updateTweetDto.hashtags.length > 0
                ? await this.hashtagService.getHashtag(updateTweetDto.hashtags, userId)
                : undefined;

            //check fetch hashtags if its empty or undefined and throw exception    
            if (fetchedHashtags?.length === 0) {
                throw new NotFoundException(`Cant find Hashtags with id${updateTweetDto.hashtags}`)
            }

            //this will set the hashtags to the dto value or replace with old hahstags 
            const hashtags: Hashtag[] = fetchedHashtags ?? tweet.hashtags;

            // apply updates
            tweet.text = updateTweetDto.text ?? tweet.text;
            tweet.image = updateTweetDto.image ?? tweet.image;
            tweet.hashtags = hashtags;


            await this.tweetRepository.save(tweet);
            const { password, ...rest } = tweet.user

            const finalResult = {
                ...tweet,
                user: rest
            }
            return finalResult

        } catch (error) {
            if (error && (error as any).code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('An error has occurred, please try again later', {
                    description: 'Could not connect to the database...',
                })
            }
            if(error.statuscode === '404'){
                throw new NotFoundException(error.response)
            }
            throw new BadRequestException(error, 'Error in Updating The Tweet');
        }
    }

    public async deleteTweet(id: number, userId: number) {
        try {
            const user = await this.userService.findUserById(userId);
            if (!user) {
                throw new NotFoundException(`User with id ${userId} was not found`);
            }

            let tweet = await this.tweetRepository.findOne({
                where: { id },
                relations: ['user', 'hashtags'],
            });

            if (!tweet) {
                throw new NotFoundException(`Tweet with id ${id} was not found`);
            }

            //check for the tweet userId and the Current User are the Same
            if (tweet.user.id !== user.id) {
                throw new UnauthorizedException('You are not allowed to update this tweet');
            }

            return await this.tweetRepository.delete({ id })
        } catch (error) {
            if (error.statuscode === '404') {
                throw new NotFoundException(error.response)
            }
            throw new UnauthorizedException(error.response)

        }

    }

}
