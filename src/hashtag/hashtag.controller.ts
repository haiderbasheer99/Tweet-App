import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { HashtagService } from './hashtag.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';

@Controller('hashtag')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService){

    }

    @Get()
    public async getAllHashtags(@ActiveUser('sub') userId: number){
        return await this.hashtagService.getAllHashtags(userId)
    }

    @Post()
    public createHashtag(@Body() createHashtagDto: CreateHashtagDto, @ActiveUser('sub') userId: number){
        return this.hashtagService.createHashtag(createHashtagDto, userId);

    }

    @Delete(':id')
    deleteHashtag(@Param('id', ParseIntPipe) id: number,
                  @ActiveUser('sub') userId:  number
    ){
        return this.hashtagService.deleteHashtag(id, userId);
    }
}
