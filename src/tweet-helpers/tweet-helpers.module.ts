import { forwardRef, Module } from '@nestjs/common';
import { TweetHelpersService } from './tweet-helpers.service';
import { UserModule } from 'src/user/user.module';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from 'src/tweet/tweet.entity';

@Module({
  imports: [
    UserModule, 
    HashtagModule, 
    TypeOrmModule.forFeature([Tweet]),
  ],
  providers: [TweetHelpersService],
  exports: [TweetHelpersService],
})
export class TweetHelpersModule {}
