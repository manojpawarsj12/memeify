import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";

export enum Status {
  Pending = "PENDING",
  Friends = "FRIENDS",
}
@ObjectType()
@Entity("friends")
export class Friends extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  friendId!: number;

  @Field()
  @Column({ unique: true })
  fromUserId: number;

  @Field()
  @Column({ unique: true })
  toUserId: number;

  @Field()
  @Column("enum", { enum: Status, default: Status.Pending })
  status: Status;

  @Unique(["userId"])
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sentRequests, {
    cascade: ["insert", "update"],
  })
  fromUser: User;

  @Unique(["userId"])
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.receivedRequests, {
    cascade: true,
  })
  toUser: User;
}
