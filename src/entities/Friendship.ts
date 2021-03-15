import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("friends")
export class Friendship extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.friendrequest)
  friendrequest: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.friends)
  friends: User;
}
