import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import AuthConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from 'src/otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider, //provide for main class
      useClass: BcryptProvider, //for the child class
    },
  ],
  exports: [AuthService, HashingProvider],
  imports: [
    OtpModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(AuthConfig),
    JwtModule.registerAsync(AuthConfig.asProvider()),
    MulterModule.register({
      storage: diskStorage({
        // diskStorage give you more advanced handling
        destination: './uploads', // the folder in project which saves images from cloudinary locally
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  ],
})
export class AuthModule {}
