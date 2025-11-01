import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Password } from '../../passwords/entities/password.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @OneToMany(() => Password, (password) => password.folder, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  passwords: Password[];
}
