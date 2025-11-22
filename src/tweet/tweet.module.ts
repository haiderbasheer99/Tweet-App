import { forwardRef, Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { TweetHelpersModule } from 'src/tweet-helpers/tweet-helpers.module';

@Module({
  controllers: [TweetController],
  providers: [TweetService],
  imports: [
    UserModule, 
    TypeOrmModule.forFeature([Tweet]), 
    HashtagModule, 
    PaginationModule,
    // forwardRef(() => TweetHelpersModule)
    TweetHelpersModule
  ],
  exports: [TweetService]
})
export class TweetModule {}
