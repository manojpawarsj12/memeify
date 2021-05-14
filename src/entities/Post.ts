import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comments } from "./Comments";
import { User } from "./User";

@ObjectType()
@Entity("posts")
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  postId: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  likes: number;

  @Field()
  @Column()
  post_text: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => User)
  @OneToMany(() => Comments, (comments) => comments.posts)
  comments: Comments[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
