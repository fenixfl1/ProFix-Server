import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductHeader } from './ProductHeader'

@Entity('CATEGORY')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id: number

  @Column({ length: 100, unique: true })
  name: string

  @OneToMany(() => ProductHeader, (product) => product.category)
  products: ProductHeader[]
}
