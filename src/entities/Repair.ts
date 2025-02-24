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

@Entity()
export class Repair extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Customer, (customer) => customer.repairs)
  customer: Customer

  @Column()
  description: string

  @Column({ nullable: true })
  status: string // 'Pendiente', 'En Proceso', 'Completado'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number

  @ManyToOne(() => User, { nullable: true }) // Técnico responsable
  assignedTo: User

  @OneToMany(() => RepairProduct, (repairProduct) => repairProduct.repair)
  usedProducts: RepairProduct[]
}
