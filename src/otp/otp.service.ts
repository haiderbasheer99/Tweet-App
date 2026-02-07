import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { OTPType } from './type/otpType';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}
  async generateOtp(
    user: Omit<User, 'password'>,
    type: OTPType,
  ): Promise<string> {
    //this will generate 6 digits otp
    const otp = crypto.randomInt(100000, 999999).toString();
    //this will hash the otp
    const hashedOtp = await bcrypt.hash(otp, 10);

    const now = new Date();
    //set the expired time to 2 min
    const expiredAt = new Date(now.getTime() + 2 * 60 * 1000);

    //to check if there already otpToken => that mean you request anew one and must update the old otpToken
    const oldOtp = await this.otpRepository.findOne({
      where: {
        user: { id: user.id },
        type,
      },
    });
    if (oldOtp) {
      //Update old otp
      oldOtp.token = hashedOtp;
      oldOtp.expiredAt = expiredAt;
      await this.otpRepository.save(oldOtp);
    } else {
      const createOtp = this.otpRepository.create({
        user,
        token: hashedOtp,
        type,
        expiredAt,
      });
      await this.otpRepository.save(createOtp);
    }
    return otp;
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validToken = await this.otpRepository.findOne({
      where: {
        user: { id: userId },
        expiredAt: MoreThan(new Date()), //check that otp token isn't expired
      },
    });
    if (!validToken) {
      throw new BadRequestException('OTP is Expired, request a New One');
    }
    const match = await bcrypt.compare(token, validToken.token);
    if (!match) {
      throw new BadRequestException('Invalid OTP, please try again..');
    }
    return true;
  }

  async deleteOtp(id: number) {
    return await this.otpRepository.delete({ id });
  }
}
