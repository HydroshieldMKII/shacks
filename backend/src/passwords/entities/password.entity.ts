import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  folderId: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  notes: string;
}
