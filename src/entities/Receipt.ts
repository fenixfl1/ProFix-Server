import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm'
import { RepairOrder } from './RepairOrder'

@Entity('receipt')
class Receipt extends BaseEntity {
  @PrimaryGeneratedColumn()
  receipt_id: number

  @OneToOne(() => RepairOrder)
  @JoinColumn({ name: 'repair_order_id' })
  repair_order: RepairOrder

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'int', default: 0 })
  reprint_count: number

  @Column({ type: 'char', default: 'P' })
  status: string // P - pending, N - Null, D - delivered, R - returned

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}

export default Receipt
