import { ObjectType, Field, ID } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comments } from "./Comments";

@ObjectType()
@Entity("CommentReplies")
export class CommentReplies extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  PCID: number;
  @Field(() => ID)
  @ManyToOne(() => Comments, (Comment) => Comment.ParentComment)
  PC: Comments;

  @Field(() => ID)
  @ManyToOne(() => Comments, (Comment) => Comment.ChildComment)
  CC: Comments;
}
