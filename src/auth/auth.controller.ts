import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AllowPublic } from './decorator/allow-public-decorator';
import { RefreshTokenDto } from './dto/refresh-Token.dto';
import { RequestTokenDto } from './dto/requestToken.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'it will return Sub,Access and refresh token in the Response',
  })
  async login(@Body() logindto: LoginDto) {
    return await this.authService.login(logindto);
  }

  @AllowPublic()
  @Post('signup')
  @ApiOperation({ summary: 'Register New User' })
  @ApiResponse({
    status: 201,
    description:
      'it will return User Created successfully and OTP sent to your Email in the Response',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.authService.signup(createUserDto);
    return { message: 'User Created successfully and OTP sent to your Email' };
  }

  @AllowPublic()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({
    status: 200,
    description: 'it will return id,Access and refresh token in the Response',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @AllowPublic()
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP number' })
  @ApiResponse({
    status: 200,
    description:
      'it will return OTP Sent Successfully. please Check Your Email in the Response',
  })
  async requestOtp(@Body() requestTokenDto: RequestTokenDto) {
    return await this.authService.requestOtp(requestTokenDto);
  }
}
