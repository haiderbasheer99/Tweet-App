import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
  imports: [
    TypeOrmModule.forFeature([Hashtag]),
    UserModule
  ]
})
export class HashtagModule {}
