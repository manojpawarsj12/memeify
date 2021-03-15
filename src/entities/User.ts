import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Friendship } from "./Friendship";
import { Post } from "./Post";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column("bool", { default: false })
  confirmed!: boolean;

  @Field(() => Post)
  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => Friendship)
  @OneToMany(() => Friendship, (friends) => friends.friends)
  friends: Friendship[];

  @Field(() => Friendship)
  @OneToMany(() => Friendship, (friends) => friends.friendrequest)
  friendrequest: Friendship[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
