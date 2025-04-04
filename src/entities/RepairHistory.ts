import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { RepairOrder } from './RepairOrder'

@Entity('repair_history')
export class RepairHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  history_id: number

  @ManyToOne(() => RepairOrder, (repair) => repair.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'repair_order_id' })
  repair: RepairOrder

  @Column({
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'],
  })
  previous_status: string

  @Column({
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'],
  })
  new_status: string

  @Column({ type: 'text' })
  comment: string
}
