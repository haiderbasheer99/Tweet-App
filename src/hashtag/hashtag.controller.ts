import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { HashtagService } from './hashtag.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('hashtag')
@ApiBearerAuth('JWT-auth') //for marking the route with swagger auth  documentaion
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hashtags' })
  @ApiResponse({
    status: 200,
    description: 'it will return all hashtags in the Response',
  })
  public async getAllHashtags(@ActiveUser('sub') userId: number) {
    return await this.hashtagService.getAllHashtags(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create hashtag' })
  @ApiResponse({
    status: 201,
    description: 'it will return the hashtag in the Response',
  })
  public createHashtag(
    @Body() createHashtagDto: CreateHashtagDto,
    @ActiveUser('sub') userId: number,
  ) {
    return this.hashtagService.createHashtag(createHashtagDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hashtag' })
  @ApiResponse({
    status: 200,
    description: 'it will delete the hashtag by id in the Response',
  })
  deleteHashtag(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.hashtagService.deleteHashtag(id, userId);
  }
}
