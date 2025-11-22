import { HttpException, HttpStatus } from "@nestjs/common";

export class AlreadyExistException extends HttpException{
    constructor(fieldName: string, fieldValue: string){
        super(`User with ${fieldName} ${fieldValue} already exists `, HttpStatus.CONFLICT)
    }
}