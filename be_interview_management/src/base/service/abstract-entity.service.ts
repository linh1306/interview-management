import { User } from '@/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  last_modified_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'last_modified_by' })
  last_modified_by: User;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted: Date;
}
