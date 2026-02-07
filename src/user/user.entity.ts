import { Hashtag } from 'src/hashtag/hashtag.entity';
import { Profile } from 'src/profile/profile.entity';
import { Tweet } from 'src/tweet/tweet.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 24,
  })
  userName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  password: string;

  @Column({ default: 'unverified' })
  accountStatus: 'verified' | 'unverified';

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['insert'],
  })
  profile?: Profile;

  @OneToMany(() => Hashtag, (hashtag) => hashtag.user)
  hashtags: Hashtag[];

  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets: Tweet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
