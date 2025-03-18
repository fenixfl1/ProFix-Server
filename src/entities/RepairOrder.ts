import { number, string } from 'joi'
import {
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Customer } from './Customer'
import { RepairProduct } from './RepairProduct'
import { Device } from './Device'
import { RepairHistory } from './RepairHistory'

@Entity('repair_order')
export class RepairOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  repair_order_id: number

  @ManyToOne(() => Device, (device) => device.repairs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device: Device

  @Column({ type: 'text' })
  reported_issue: string

  @Column({ type: 'text', nullable: true })
  diagnosis: string

  @Column({
    nullable: true,
    default: 'P',
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'],
  })
  status: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_cost: number

  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  advanced_payment?: number

  @Column({ type: 'timestamp', nullable: true })
  delivery_date: Date

  @OneToMany(() => RepairProduct, (repairProduct) => repairProduct.repair)
  used_products: RepairProduct[]

  @OneToMany(() => RepairHistory, (repairHistory) => repairHistory.repair)
  history: RepairHistory[]
}
