import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { RequestStatus, RequestLevel } from '../request.constant';

@Entity()
export class Request extends AbstractEntity {
  @Column()
  position: string;

  @Column()
  quantity: number;

  @Column()
  workplace: string;

  @Column('simple-array')
  level: RequestLevel[];

  @Column()
  department: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.Pending
  })
  status: RequestStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}