import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Friends } from "./Friends";
import { Post } from "./Post";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  userId: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password!: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => Post)
  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => Friends)
  @OneToMany(() => Friends, (friendStatus) => friendStatus.fromUser)
  sentRequests: Friends[];

  @Field(() => Friends)
  @OneToMany(() => Friends, (friendStatus) => friendStatus.toUser)
  receivedRequests: Friends[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
