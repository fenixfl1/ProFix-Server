import { number, string } from 'joi'
import {
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Customer } from './Customer'
import { RepairProduct } from './RepairProduct'
import { Device } from './Device'
import { RepairHistory } from './RepairHistory'

@Entity('repair')
export class Repair extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Device, (device) => device.repairs, { onDelete: 'CASCADE' })
  device: Device

  @Column({ type: 'text' })
  reported_issue: string

  @Column({ type: 'text', nullable: true })
  diagnosis: string

  @Column({
    nullable: true,
    default: 'P',
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'], // P: pending, I: in progress, R: repaired, N: not repaired //falta entregado
  })
  status: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_cost: number

  // columna para indicar si se tomo un adelanto

  @Column({ type: 'timestamp', nullable: true })
  delivery_date: Date

  @Column({ default: false })
  customer_signature: boolean

  @ManyToOne(() => User, { nullable: true }) // Técnico responsable
  assigned_staff: User

  @OneToMany(() => RepairProduct, (repairProduct) => repairProduct.repair)
  used_products: RepairProduct[]

  @OneToMany(() => RepairHistory, (repairHistory) => repairHistory.repair)
  history: RepairHistory[]
}
