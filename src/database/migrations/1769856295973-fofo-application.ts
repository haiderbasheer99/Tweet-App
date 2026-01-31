import { MigrationInterface, QueryRunner } from "typeorm";

export class FofoApplication1769856295973 implements MigrationInterface {
    name = 'FofoApplication1769856295973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tweet" ("id" SERIAL NOT NULL, "text" text NOT NULL, "image" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_6dbf0db81305f2c096871a585f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hashtag" ("id" SERIAL NOT NULL, "text" text NOT NULL, "userId" integer, CONSTRAINT "UQ_cbe822e272caf8749f233d7f6c6" UNIQUE ("text"), CONSTRAINT "PK_cb36eb8af8412bfa978f1165d78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "firstName" character varying(100), "lastName" character varying(100), "gender" character varying(10), "dateOfBirth" TIMESTAMP, "bio" text, "profileImage" text, "userId" integer, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(24) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "accountStatus" character varying NOT NULL DEFAULT 'unverified', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_type_enum" AS ENUM('otp', 'reset_password')`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tweet_hashtags_hashtag" ("tweetId" integer NOT NULL, "hashtagId" integer NOT NULL, CONSTRAINT "PK_8fe882a39e40497b6aa7e2b1bea" PRIMARY KEY ("tweetId", "hashtagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d676e307309893940ea489b8a" ON "tweet_hashtags_hashtag" ("tweetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e567cf4159f79b9f48e649dc73" ON "tweet_hashtags_hashtag" ("hashtagId") `);
        await queryRunner.query(`ALTER TABLE "tweet" ADD CONSTRAINT "FK_a9703cf826200a2d155c22eda96" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hashtag" ADD CONSTRAINT "FK_d62ef151164b28173db01d75071" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweet_hashtags_hashtag" ADD CONSTRAINT "FK_9d676e307309893940ea489b8a0" FOREIGN KEY ("tweetId") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tweet_hashtags_hashtag" ADD CONSTRAINT "FK_e567cf4159f79b9f48e649dc73c" FOREIGN KEY ("hashtagId") REFERENCES "hashtag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tweet_hashtags_hashtag" DROP CONSTRAINT "FK_e567cf4159f79b9f48e649dc73c"`);
        await queryRunner.query(`ALTER TABLE "tweet_hashtags_hashtag" DROP CONSTRAINT "FK_9d676e307309893940ea489b8a0"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "hashtag" DROP CONSTRAINT "FK_d62ef151164b28173db01d75071"`);
        await queryRunner.query(`ALTER TABLE "tweet" DROP CONSTRAINT "FK_a9703cf826200a2d155c22eda96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e567cf4159f79b9f48e649dc73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d676e307309893940ea489b8a"`);
        await queryRunner.query(`DROP TABLE "tweet_hashtags_hashtag"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "hashtag"`);
        await queryRunner.query(`DROP TABLE "tweet"`);
    }

}
