import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OTPType } from "./type/otpType";

@Entity()
export class Otp{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn()
    user: User;

    @Column()
    token: string; //gonna be hashed in database and will be used for verification 

    @Column({type: 'enum', enum: OTPType})
    type: OTPType;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiredAt: Date
}