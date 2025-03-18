import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Device } from './Device'

@Entity({ name: 'phone_brands' })
export class PhoneBrand extends BaseEntity {
  @PrimaryGeneratedColumn()
  brand_id: number

  @Column({ unique: true })
  name: string

  @OneToMany(() => Device, (brand) => brand.brand, { onDelete: 'CASCADE' })
  device: Device[]
}
