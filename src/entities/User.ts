import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  Generated,
} from "typeorm";

import * as bcrypt from "bcrypt";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Generated("uuid")
  user_id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar" })
  FirstName!: string;

  @Column({ type: "varchar" })
  LastName!: string;

  @Column()
  password!: string;

  @Column()
  age!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  
  async hashpasswords() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  async comparePassword(attempt_password: string): Promise<boolean> {
    return await bcrypt.compare(attempt_password, this.password);
  }
}
