import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  price: number;
}
