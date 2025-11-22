import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AllowPublic } from './decorator/allow-public-decorator';
import { RefreshTokenDto } from './dto/refresh-Token.dto';
import { RequestTokenDto } from './dto/requestToken.dto';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @AllowPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() logindto: LoginDto){
        return await this.authService.login(logindto);
    }

    @AllowPublic()
    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto){
        await this.authService.signup(createUserDto);
        return {message: 'User Created successfully and OTP sent yo your Email'}
    }

    @AllowPublic()
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
        return await this.authService.refreshToken(refreshTokenDto)
    }

    @AllowPublic()
    @Post('request-otp')
    @HttpCode(HttpStatus.OK)
    async requestOtp(@Body() requestTokenDto: RequestTokenDto){
        return await this.authService.requestOtp(requestTokenDto);
    }

}
