import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import AuthConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { ActiveUserType } from 'src/interfaces/active-user-type.interface';
import { RefreshTokenDto } from './dto/refresh-Token.dto';
import { OtpService } from 'src/otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestTokenDto } from './dto/requestToken.dto';
import { OTPType } from 'src/otp/type/otpType';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly otpService: OtpService,

    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async login(logindto: LoginDto) {
    try {
      const { otp } = logindto;
      //FIND THE USER WITH THE GIVEN USERNAME
      let user = await this.userService.findUserByUsername(logindto.username);

      //IF USER AVAILABLE, COMPARE THE PASSWORD
      let compare: boolean = false;

      compare = await this.hashingProvider.comparePassword(
        logindto.password,
        user.password,
      );

      //IF PASSWORD IS NOT CORRECT THROW ERROR
      if (!compare) {
        throw new UnauthorizedException('Incorrect Password');
      }

      if (user.accountStatus === 'unverified') {
        if (!otp) {
          return {
            message: 'Your account is not verified, please provide your otp..',
          };
        } else {
          await this.verifyToken(user.id, otp);
        }
      }

      //GENERATE JWT TOKEN & REFRESH TOKEN - SEND THE RESPONSE
      return this.generateToken(user);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Login Failed plaese provide right credentials',
      );
    }
  }

  async verifyToken(userId: number, token: string) {
    await this.otpService.validateOtp(userId, token);

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    // if it pass that mean otp is valid, account is verified
    user.accountStatus = 'verified';
    const enduser = await this.userRepository.save(user);
    const { password, ...result } = enduser;
    return result;
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      //1. VERIFY THE REFRESH TOKEN
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfig.secret,
          audience: this.authConfig.audience,
          issuer: this.authConfig.issuer,
        },
      );

      //2. EXTRACT USERID FROM PAYLOAD AND FIND USER WITH IT
      const user = await this.userService.findUserById(sub);

      //3. GENERATE AN ACCESS TOKEN AND REFRESH TOKEN
      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error.response);
    }
  }

  async requestOtp(requestTokenDto: RequestTokenDto) {
    try {
      const userWithEmail = await this.userService.findUserWithEmail(
        requestTokenDto.email,
      );
      if (!userWithEmail) {
        throw new NotFoundException(
          `User With Email ${requestTokenDto.email} Not Found`,
        );
      }
      await this.userService.emailVerification(userWithEmail, OTPType.OTP);
      return {
        message: 'OTP Sent Successfully. please Check Your Email',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.response);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfig.secret,
        expiresIn: expiresIn,
        audience: this.authConfig.audience,
        issuer: this.authConfig.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    //GENERATE ACCESS TOKEN
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfig.expiresIn,
      { email: user.email },
    );

    //GENERATE REFRESH TOKEN
    const refreshToken = await this.signToken(
      user.id,
      this.authConfig.refreshTokenExpiresIn,
    );

    return {
      id: user.id,
      token: accessToken,
      refreshToken,
    };
  }
}
