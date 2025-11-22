import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import EmailConfig from './config/email.config'
import { ConfigType } from '@nestjs/config';
import { SendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
    constructor(
        @Inject(EmailConfig.KEY)
        private readonly emailConfig: ConfigType<typeof EmailConfig>
    ){}
    emailTransport(){
        const transporter = nodemailer.createTransport({
            host: this.emailConfig.host,
            port: this.emailConfig.port,
            secure: false,
            auth: {
                user: this.emailConfig.user,
                pass: this.emailConfig.pass
            }
        })
        return transporter;
    }

    async sendEmail(sendEmaildto: SendEmailDto){
        const {recipients,subject, html} = sendEmaildto;

        const transport = this.emailTransport();

        const options: nodemailer.SendMailOption = {
            from: this.emailConfig.user,
            to: recipients,
            subject: subject,
            html: html
        }
        try {
            await transport.sendMail(options);
            console.log('EMAIL SUCCESSFULLY SENT');
        } catch (error) {
            throw new BadRequestException('Error During Sending MAIL')
        }
    }
}
