import {
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  BaseEntity as Base,
  JoinColumn,
} from 'typeorm'
import { User } from './User'

export abstract class BaseEntity extends Base {
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date | null

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by?: User | null

  @Column({ type: 'char', length: 1, default: 'A' })
  state: string | null
}
