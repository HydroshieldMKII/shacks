import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
