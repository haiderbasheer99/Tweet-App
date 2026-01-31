import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowPublic } from './auth/decorator/allow-public-decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @AllowPublic()
  @Get()
  @ApiOperation({ summary: 'Home Page' })
  @ApiResponse({
    status: 200,
    description: 'it will return WELCOME TO MY TWEET APP',
  })
  @ApiBearerAuth('JWT-auth') //for marking the route with swagger auth  documentaion
  getHello(): string {
    return this.appService.getHello();
  }
}
