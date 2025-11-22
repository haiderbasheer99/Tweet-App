import { Injectable } from '@nestjs/common';
import * as bcript from 'bcrypt';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {

    public async hashPassword(data: string | Buffer): Promise<string> {
        //GENERATE SALT
        let salt = await bcript.genSalt();

        //HASH THE PASSWORD//
        return await bcript.hash(data, salt);
    }

    public async comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {
        //COMPARE BETWEEN THE PLAIN PASSWORD AND THE HAHSED PASSWORD
        return await bcript.compare(plainPassword, hashedPassword);
    }
}
