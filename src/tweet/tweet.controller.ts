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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tweet')
@ApiBearerAuth('JWT-auth') //for marking the route with swagger auth  documentaion
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tweets' })
  @ApiResponse({
    status: 200,
    description:
      'it will return all tweets by the current User in the Response',
  })
  getAllTweets(
    @ActiveUser('sub') userId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.tweetService.getAllTweets(userId, paginationDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tweet' })
  @ApiResponse({
    status: 201,
    description: 'it will return the tweet in the Response',
  })
  createTweet(
    @Body() createTweetDto: CreateTweetDto,
    @ActiveUser('sub') userId,
  ) {
    // console.log(user);
    return this.tweetService.createTweet(createTweetDto, userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update tweet' })
  @ApiResponse({
    status: 200,
    description: 'it will return updated tweet in the Response',
  })
  updateTweet(
    @Body() tweet: UpdateTweetDto,
    @ActiveUser('sub') userId: number,
  ) {
    return this.tweetService.updateTweet(tweet, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tweet' })
  @ApiResponse({
    status: 200,
    description: 'it will delete the tweet by id in the Response',
  })
  deleteTweet(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.tweetService.deleteTweet(id, userId);
  }
}
