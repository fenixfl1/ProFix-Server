import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductDetail } from './ProductDetail'
import { Category } from './Category'

@Entity('product_header')
export class ProductHeader extends BaseEntity {
  @PrimaryGeneratedColumn()
  product_id: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 250, nullable: true })
  description?: string

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id'})
  category: Category

  @OneToMany(() => ProductDetail, (detail) => detail.product)
  details: ProductDetail[]
}
