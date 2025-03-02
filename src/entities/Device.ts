import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Customer } from './Customer'
import { Repair } from './Repair'

@Entity('device')
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  device_id: number

  @ManyToOne(() => Customer, (customer) => customer.devices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @Column({ length: 50 })
  brand: string

  @Column({ length: 50 })
  model: string

  @Column({ length: 50, unique: true })
  imei: string

  @Column({ length: 25, nullable: true })
  color: string

  @Column({ type: 'text', nullable: true })
  accessories: string

  @Column({ type: 'text', nullable: true })
  physical_condition: string

  @OneToMany(() => Repair, (repair) => repair.device)
  repairs: Repair[]
}
