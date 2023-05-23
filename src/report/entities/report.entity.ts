import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  price: number;
}
