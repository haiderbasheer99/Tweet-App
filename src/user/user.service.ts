import {
  BadRequestException,
  // ConflictException,
  forwardRef,
  // HttpException,
  // HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  // RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { AlreadyExistException } from 'src/customExceptionHandler/alreadyExists.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/type/otpType';
import { EmailService } from 'src/email/email.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { CloudinaryService } from 'src/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private readonly paginationProvider: PaginationProvider,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async getAll(paginationQueryDto: PaginationDto) {
    try {
      let allUser = await this.paginationProvider.paginateQuery(
        paginationQueryDto,
        this.userRepository,
        undefined,
        ['profile'],
      );

      let { data, ...rest } = allUser;
      let safeData = data.map((user) => {
        if (user && user.password) {
          const { password, ...safeUser } = user;
          return safeUser;
        }
      });
      return { data: safeData, rest };
    } catch (error) {
      throw new BadRequestException('Could Not Paginate All the Users');
    }
  }

  public async createUser(userdto: CreateUserDto) {
    try {
      //first create User-profile object and save it
      //NOTE THIS IS VERY IMPORTANT

      if (userdto.profile && userdto.profile.profileImage) {
        //checking if profileImage is provided
        const uploadResult = await this.cloudinaryService.uploadImage(
          userdto.profile.profileImage,
        );
        userdto.profile.profileImage = uploadResult.secure_url; //saving secure_url in the profileImage
      }
      userdto.profile = userdto.profile ?? {};

      //check if there already a User with email or username
      const userwithUserName = await this.userRepository.findOne({
        where: { userName: userdto.userName },
      });
      if (userwithUserName) {
        throw new AlreadyExistException('userName', userdto.userName);
      }

      const userwithEmail = await this.userRepository.findOne({
        where: { email: userdto.email },
      });
      if (userwithEmail) {
        throw new AlreadyExistException('email', userdto.email);
      }

      //create user object
      let user = this.userRepository.create({
        ...userdto,
        password: await this.hashingProvider.hashPassword(userdto.password),
      });

      //save the user object
      await this.userRepository.save(user);
      return this.emailVerification(user, OTPType.OTP);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('duplicated credentials for the user');
      }
      throw error;
    }
  }

  public async updateUserProfile(profileDto: UpdateProfileDto, userId: number) {
    try {
      let user = await this.findUserById(userId);
      let profile = await this.profileRepository.findOne({
        where: { id: profileDto.id },
        relations: ['user'],
      });
      if (!profile) {
        throw new NotFoundException(
          `there is no profile with this ${profileDto.id} id`,
        );
      }

      if (profile.user.id !== userId) {
        throw new UnauthorizedException(
          'You are NOT ALLOWED to Update this Profile!!',
        );
      }

      profile.firstName = profileDto.firstName ?? profile.firstName;
      profile.lastName = profileDto.lastName ?? profile.lastName;
      profile.gender = profileDto.gender ?? profile.gender;
      profile.dateOfBirth = profileDto.dateOfBirth ?? profile.dateOfBirth;
      profile.bio = profileDto.bio ?? profile.bio;

      if (profileDto.profileImage) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          profileDto.profileImage,
        );
        profile.profileImage = uploadResult.secure_url;
      } else profile.profileImage = profile.profileImage;
      let { password, ...rest } = user;
      const TheProfile = await this.profileRepository.save(profile);
      return { ...TheProfile, user: rest };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error);
      }
      // throw new BadRequestException(error.response)
      throw error;
    }
  }

  public async emailVerification(
    user: Omit<User, 'password'>,
    otpType: OTPType,
  ) {
    try {
      const otp = await this.otpService.generateOtp(user, otpType);
      const emailMessage = {
        recipients: [user.email],
        subject: 'Otp for Verification',
        html: `Here is Your Otp <stong>${otp}</strong> <br />to vrify your login`,
      };
      return await this.emailService.sendEmail(emailMessage);
    } catch (error) {
      throw new BadRequestException(`Could Not Send The Otp To ${user.email}`);
    }
  }

  public async deleteUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException(`the User with id ${userId} was Not Found`);
      }

      await this.otpService.deleteOtp(userId);
      return await this.userRepository.delete(userId);

      //this comment is for Refrence
      // if (!user) {
      //     throw new HttpException({
      //         status: HttpStatus.NOT_FOUND,
      //         error: `the User with id ${id} was Not Found`,
      //         table: 'users'
      //     },
      //         HttpStatus.NOT_FOUND
      //     )
      // }
    } catch (error) {
      throw new NotFoundException(error.response);
    }
  }

  public async findUserById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`the User with id ${id} was Not Found`);

        //this code below decribe how to throw HttpException
        // throw new HttpException({
        //     status: HttpStatus.NOT_FOUND,
        //     error: `the User with id ${id} was Not Found`,
        //     table: 'users'
        // },
        //     HttpStatus.NOT_FOUND
        // )
      }
      return user;
    } catch (error) {
      throw new NotFoundException(error.response);
    }
  }

  public async findUserByUsername(username: string): Promise<User> {
    try {
      let user: User | null;
      user = await this.userRepository.findOneBy({ userName: username });

      if (!user) {
        throw new NotFoundException(
          `User with this userName ${username} Does not Exist!`,
        );
      }

      return user;
    } catch (error) {
      throw new NotFoundException(error.response);
    }
  }

  public async findUserWithEmail(
    email: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      let user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(
          `User with this email${email} Does not Exist!`,
        );
      }
      const { password, ...result } = user;
      return result;
      // return user;  if you want to return it with password
    } catch (error) {
      throw new NotFoundException(error.response);
    }
  }
}
