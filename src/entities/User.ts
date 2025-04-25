import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'
import { Role } from './Role'
import Business from './Business'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column({ unique: true })
  username: string

  @Column({ length: 20, nullable: false })
  name: string

  @Column({ length: 50, nullable: false })
  last_name: string

  @Column({ length: 1 })
  gender: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column('text')
  avatar: string

  @Column()
  phone: string

  @Column({ unique: true })
  identity_document: string

  @Column()
  document_type: string

  @Column({ type: 'date' })
  birth_date: Date

  @Column({ length: 200 })
  address: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User

  @Column({ type: 'char', length: 1, default: 'A' })
  state: string

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_x_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
  })
  roles: Role[]

  @ManyToOne(() => Business, { nullable: false })
  @JoinColumn({ name: 'business_id' })
  business: Business
}
