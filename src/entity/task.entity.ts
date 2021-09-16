import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  priorite: string;

  @ManyToOne(() => User, user => user.tasks)
  user: User;
}
