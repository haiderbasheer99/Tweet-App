import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profile/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuthModule } from 'src/auth/auth.module';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';
import { CloudinaryService } from 'src/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [UserController],
  providers: [UserService, CloudinaryService],
  exports: [UserService],
  imports: [
    forwardRef(() => ProfileModule),
    TypeOrmModule.forFeature([User, Profile]),
    ProfileModule,
    PaginationModule,
    OtpModule,
    EmailModule,
    forwardRef(() => AuthModule),
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
export class UserModule {}
