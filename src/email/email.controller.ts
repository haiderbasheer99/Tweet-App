import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';
import { AllowPublic } from 'src/auth/decorator/allow-public-decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @AllowPublic()
  @Post('send')
  @ApiOperation({ summary: 'send email' })
  @ApiResponse({
    status: 201,
    description: 'it will return Email Sent Successfully in the Response',
  })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto);
    return { message: 'Email Sent Successfully' };
  }
}
