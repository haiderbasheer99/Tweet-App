import { Tweet } from "src/tweet/tweet.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hashtag{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        unique: true
    })
    text: string;
    
    @ManyToOne(()=> User, (user) => user.hashtags)
    user: User

    @ManyToMany(()=> Tweet, (tweet) => tweet.hashtags, {onDelete: 'CASCADE'})
    tweets: Tweet[]


}