import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductHeader } from './ProductHeader'

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ type: 'text' })
  description: string

  @OneToMany(() => ProductHeader, (product) => product.category)
  products: ProductHeader[]
}
