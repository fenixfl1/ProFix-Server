import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Entity('business')
class Business extends BaseEntity {
  @PrimaryGeneratedColumn()
  business_id: number

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text' })
  rnc: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text' })
  address: string

  @Column({ type: 'text' })
  phone: string

  @Column({ type: 'enum', enum: ['A', 'I'], default: 'A' })
  state: string

  @OneToMany(() => User, (user) => user.business)
  users: User[]
}

export default Business
