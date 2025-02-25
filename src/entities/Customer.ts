import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Repair } from './Repair'

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  customer_id: number

  @Column()
  name: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  address: string

  @OneToMany(() => Repair, (repair) => repair.customer)
  repairs: Repair[]
}
