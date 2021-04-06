import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity("comments")
export class Comments extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  commentId: number;

  @Field(() => ID)
  @Column()
  userId: number;

  @Field(() => ID)
  @Column()
  postId: number;

  @Field(() => ID)
  @Column()
  comment_text: string;

  @Field()
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn()
  user: User;

  @Field()
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn()
  posts: Post;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
