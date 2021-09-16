import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  birthDate: Date;

  @Column()
  email: string;

  @Column({ length: 6 })
  emailCode: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
