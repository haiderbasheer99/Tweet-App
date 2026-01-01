import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  getAllTweets(
    // (@Param('userId', ParseIntPipe)
    @ActiveUser('sub') userId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    // console.log(paginationDto);
    return this.tweetService.getAllTweets(userId, paginationDto);
  }

  @Post()
  createTweet(
    @Body() createTweetDto: CreateTweetDto,
    @ActiveUser('sub') userId,
  ) {
    // console.log(user);
    return this.tweetService.createTweet(createTweetDto, userId);
  }

  @Patch()
  updateTweet(
    // @Param('id', ParseIntPipe) id: number,
    @Body() tweet: UpdateTweetDto,
    @ActiveUser('sub') userId: number,
  ) {
    return this.tweetService.updateTweet(tweet, userId);
  }

  @Delete(':id')
  deleteTweet(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.tweetService.deleteTweet(id, userId);
  }
}
