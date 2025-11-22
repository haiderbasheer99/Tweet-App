import { Injectable } from '@nestjs/common';

@Injectable()
//Iam Using Abstracrt class so whenever i changed the Hashing algorith
export abstract class HashingProvider {

    abstract hashPassword(data: string | Buffer): Promise<string>

    abstract comparePassword(
        plainPassword: string | Buffer, 
        hashedPassword: string | Buffer 
    ): Promise<boolean>
    
}
