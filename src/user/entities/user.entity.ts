import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  AfterInsert,
  AfterRemove,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @AfterInsert()
  logInser() {
    return 'Insert';
  }
  @AfterRemove()
  logRemove() {
    return 'Remove';
  }
}
