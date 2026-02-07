import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { PaginationModule } from './common/pagination/pagination.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import envVallidator from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthrizeGuard } from './auth/guard/authrize.guard';
import AuthConfig from 'src/auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { TweetHelpersModule } from './tweet-helpers/tweet-helpers.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Profile } from './profile/profile.entity';
import { Otp } from './otp/otp.entity';
import { Hashtag } from './hashtag/hashtag.entity';
import { Tweet } from './tweet/tweet.entity';
import { User } from './user/user.entity';
import { CloudinaryService } from './cloudinary.service';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UserModule,
    TweetModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig],
      validationSchema: envVallidator,
    }),
    // TypeOrmModule.forRootAsync({         uncomment from line 41 to 56 if you don't use migration
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     // entities: [User],
    //     //intstad of loading Entity manually you can use next line
    //     autoLoadEntities: configService.get('database.autoloadEntities'),
    //     synchronize: configService.get('database.syncronize'),
    //     host: configService.get('database.host'),
    //     port: +configService.get('database.port'),
    //     username: configService.get('database.username'),
    //     password: configService.get('database.password'),
    //     database: configService.get('database.name'),
    //   }),
    // }),
    // TypeOrmModule.forRoot({       setting when you use migration with neon or any cloud database
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   autoLoadEntities: false,
    //   synchronize: false, // migrations control schema
    //   entities: [User, Tweet, Hashtag, Otp, Profile],
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
    TypeOrmModule.forRoot({
      // setting when using migration with local database
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: false,
      synchronize: false,
      entities: [User, Tweet, Hashtag, Otp, Profile],
    }),
    ThrottlerModule.forRoot({ throttlers: [{ limit: 4, ttl: seconds(10) }] }),
    ProfileModule,
    HashtagModule,
    PaginationModule,
    AuthModule,
    ConfigModule.forFeature(AuthConfig),
    JwtModule.registerAsync(AuthConfig.asProvider()),
    TweetHelpersModule,
    EmailModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthrizeGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CloudinaryService,
  ],
})
export class AppModule {}
