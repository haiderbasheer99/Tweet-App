import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService} from '@nestjs/config'
import { appConfig } from './config/app.config';
import { PaginationModule } from './common/pagination/pagination.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import envVallidator from './config/env.validation'
import { APP_GUARD } from '@nestjs/core';
import { AuthrizeGuard } from './auth/guard/authrize.guard';
import AuthConfig from 'src/auth/config/auth.config'
import { JwtModule } from '@nestjs/jwt';
import { TweetHelpersModule } from './tweet-helpers/tweet-helpers.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UserModule, 
    TweetModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig],
      validationSchema: envVallidator
    }), 
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      // entities: [User],
      //intstad of loading Entity manually you can use next line
      autoLoadEntities: configService.get('database.autoloadEntities'),
      synchronize: configService.get('database.syncronize'),
      host: configService.get('database.host'),
      port: +configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.name')
    })
  }),
  ThrottlerModule.forRoot({throttlers: [{limit: 4, ttl: seconds(10)}]}),
  ProfileModule, HashtagModule, PaginationModule, AuthModule,
      ConfigModule.forFeature(AuthConfig),
      JwtModule.registerAsync(AuthConfig.asProvider()),
      TweetHelpersModule,
      EmailModule,
      OtpModule
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: AuthrizeGuard
    },
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule { }
