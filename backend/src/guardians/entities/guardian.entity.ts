import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Guardian {
  @PrimaryGeneratedColumn()
  id: number;

  // User who is being guarded
  @Column()
  guardedUserId: number;

  // User who is the guardian
  @Column()
  userId: number;

  // Unique key for social access with guarded user
  @Column()
  guardianKeyValue: string;
}
