import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import AuthConfig from "../config/auth.config";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_KEY } from "src/constant/constants";

@Injectable()
export class AuthrizeGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(AuthConfig.KEY)
        private readonly authConfig: ConfigType<typeof AuthConfig>,

        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride('isPublic', [
                context.getHandler(),
                context.getClass()
            ]);
            //READ IS PUBLIC METADATA if its true You shall pass
            if(isPublic){
                return true;
            }

        try {
            //1. EXTRACT REQUEST FROM EXCUTION CONTEXT
            const request: Request = context.switchToHttp().getRequest();

            //2. EXTRACT TOKEN FROM THE REQUEST HEADER
            // ['Bearer' ,'token']
            const token = request.headers.authorization?.split(' ')[1];

            //3. VALIDATE TOKEN THEN PROVIDE / DENY ACCESS
            if(!token){
                throw new UnauthorizedException('You Dont Have Token, You Are Not AUTHERIZED')
            }
            //verifyAsync will return the Payload That You Signed With
            const payload = await this.jwtService.verifyAsync(token, this.authConfig);

            //iam Signing [user] property That contain payload to the Request 
            request[REQUEST_USER_KEY] = payload;
            console.log(payload);

            return true;

        } catch (error) {
            throw new UnauthorizedException(error.response)
        }
    }

}