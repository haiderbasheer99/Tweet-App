import { Injectable, RequestTimeoutException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from 'src/tweet/dto/create-tweet.dto';
import { UserService } from 'src/user/user.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { User } from 'src/user/user.entity'; 
import { Hashtag } from 'src/hashtag/hashtag.entity';
import { Tweet } from 'src/tweet/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TweetHelpersService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,

    @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
  ) {}

  async fetchUserAndHashtags(createTweetDto: CreateTweetDto, userId: number): Promise<{ user: User; hashtags: Hashtag[] }> {
 
    try {
       let user = await this.userService.findUserById(userId);
       let hashtags = (createTweetDto.hashtags
        ? await this.hashtagService.getHashtag(createTweetDto.hashtags, userId)
        : []) ?? [];

      return { user, hashtags };
      
    } catch (error) {
      throw new RequestTimeoutException(error, 'Cant fetch User And Hashtags');
    }
  }

  async saveTweet(createTweetDto: CreateTweetDto, user: User, hashtags: Hashtag[]): Promise<{ data: Tweet; success: boolean }> {
    
    //check if there wrong insert for the Hashtags
    if (createTweetDto?.hashtags && hashtags && createTweetDto.hashtags.length !== hashtags.length) {
      throw new BadRequestException('Wrong Hashtags, Please Provide Correct One');
    }
    const { password, ...safeUser } = user;
      
    const tweet = this.tweetRepository.create({ ...createTweetDto, user: safeUser as User, hashtags });

    

    try {
      // const {password, ...result} = tweet;
      const data = await this.tweetRepository.save(tweet);
      // console.log(data);
      return { data, success: true };
    } catch (error) {
      throw new ConflictException(error.response);
    }
  }
}
