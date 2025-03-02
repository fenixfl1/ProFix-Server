import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Device } from './Device'

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  customer_id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  identity_document: string

  @Column({ nullable: false, unique: true })
  username: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  address: string

  @OneToMany(() => Device, (repair) => repair.customer)
  devices: Device[]
}
