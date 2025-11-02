import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Folder } from '../../folders/entities/folder.entity';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  folderId: number | null;

  @ManyToOne(() => Folder, (folder) => folder.passwords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

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
