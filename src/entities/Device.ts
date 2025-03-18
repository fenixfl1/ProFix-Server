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
import { RepairOrder } from './RepairOrder'
import { PhoneBrand } from './PhoneBrand'

@Entity('device')
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  device_id: number

  @ManyToOne(() => Customer, (customer) => customer.devices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @ManyToOne(() => PhoneBrand, (brand) => brand.device)
  @JoinColumn({ name: 'brand_id' })
  brand: PhoneBrand

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

  @OneToMany(() => RepairOrder, (repair) => repair.device)
  repairs: RepairOrder[]
}
