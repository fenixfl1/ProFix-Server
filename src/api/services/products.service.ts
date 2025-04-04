import { AppDataSource } from 'src/config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from 'src/constants/status-codes'
import { Category } from 'src/entities/Category'
import { ProductDetail } from 'src/entities/ProductDetail'
import { ProductHeader } from 'src/entities/ProductHeader'
import { User } from 'src/entities/User'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import { NotFoundException } from 'src/helpers/error-api'
import { paginatedQuery } from 'src/helpers/paginated-query'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
  SessionData,
} from 'src/types/api.types'

export interface CreateProductDetailPayload {
  product_header_id: number
  details: Partial<ProductDetail>[]
}

export interface CreateProductHeaderPayload {
  name: string
  description: string
  category_id: number
}

export class ProductsService {
  private userRepository = AppDataSource.getRepository(User)
  private categoryRepository = AppDataSource.getRepository(Category)
  private productHeaderRepository = AppDataSource.getRepository(ProductHeader)
  private productDetailRepository = AppDataSource.getRepository(ProductDetail)
  private manager = AppDataSource.manager

  async createProductHeader(
    payload: CreateProductHeaderPayload,
    session: SessionData
  ): Promise<ApiResponse<ProductHeader>> {
    const { category_id } = payload
    const user = await this.userRepository.findOneBy({
      user_id: session.userId,
    })

    const category = await this.categoryRepository.findOneBy({ category_id })
    if (!category) {
      throw new NotFoundException(
        `Categoría con id '${category_id}' no encontrada.`
      )
    }

    delete payload.category_id

    const header = this.productHeaderRepository.create({
      ...payload,
      created_by: user,
      created_at: new Date(),
      state: 'A',
      category,
    })

    const data = await this.productHeaderRepository.save(header)

    delete data.created_by

    return { data, message: 'Tipo de producto creado con éxito' }
  }

  async updateProductHeader(
    payload: Partial<ProductHeader> & { category_id: number },
    session: SessionData
  ): Promise<ApiResponse<ProductHeader>> {
    const { product_id, category_id } = payload
    const product = await this.productHeaderRepository.findOneBy({ product_id })
    if (!product) {
      throw new NotFoundException(
        `Producto con id '${product_id}' no encontrado.`
      )
    }

    const user = await this.userRepository.findOneBy({
      user_id: session.userId,
    })

    let category: Category
    if (category_id) {
      category = await this.categoryRepository.findOneBy({ category_id })
      if (!category) {
        throw new NotFoundException(
          `Categoría con id '${category_id}' no encontrada.`
        )
      }
    } else {
      category = product.category
    }

    const updatedProduct = this.productHeaderRepository.merge(product, {
      ...payload,
      updated_at: new Date(),
      updated_by: user,
    })

    await this.productHeaderRepository.save(updatedProduct)

    return {
      data: updatedProduct,
      message: 'Tipo de producto actualizado con éxito',
    }
  }

  async createProductDetail(
    payload: CreateProductDetailPayload,
    session: SessionData
  ): Promise<ApiResponse<ProductHeader>> {
    const { product_header_id } = payload

    return this.manager.transaction(async (entityManager) => {
      const productHeader = await entityManager.findOneBy(ProductHeader, {
        product_id: product_header_id,
      })
      if (!productHeader) {
        throw new NotFoundException(
          `Product con id '${product_header_id}' no encontrado.`
        )
      }

      const user = await entityManager.findOneBy(User, {
        user_id: session.userId,
      })

      const details = payload.details.map((item) => ({
        ...item,
        product: productHeader,
        created_by: user,
        created_at: new Date(),
      }))

      const productDetails = entityManager.create(ProductDetail, details)
      await entityManager.save(ProductDetail, productDetails)

      return { message: 'Productos almacenados con éxito' }
    })
  }

  async updateProductDetail(
    payload: Partial<ProductDetail>,
    session: SessionData
  ): Promise<ApiResponse<ProductDetail>> {
    const { product_detail_id } = payload
    const product = await this.productDetailRepository.findOneBy({
      product_detail_id,
    })
    if (!product) {
      throw new NotFoundException(
        `Producto con id '${product_detail_id}' no encontrado.`
      )
    }

    const user = await this.userRepository.findOneBy({
      user_id: session.userId,
    })

    const updatedProduct = this.productDetailRepository.merge(product, {
      ...product,
      ...payload,
      updated_at: new Date(),
      updated_by: user,
    })

    await this.productDetailRepository.save(updatedProduct)

    return { data: updatedProduct }
  }

  async createCategory(
    payload: Partial<Category>,
    session: SessionData
  ): Promise<ApiResponse<Category>> {
    const user = await this.userRepository.findOneBy({
      user_id: session.userId,
    })

    const category = this.categoryRepository.create({
      ...payload,
      created_by: user,
      created_at: new Date(),
      state: 'A',
    })

    const data = await this.categoryRepository.save(category)

    delete data.created_by

    return { data }
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const categories = await this.categoryRepository.find({
      where: { state: 'A' },
    })

    if (!categories) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data: categories }
  }

  async getProductHeaders(
    conditions: AdvancedCondition[],
    query: QueryParams
  ): Promise<ApiResponse<ProductHeader[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      SELECT 
        *
      FROM (
        SELECT 
          ph.product_id,
          ph.name,
          ph.description,
          ph.state,
          ph.created_at,
          ph.updated_at,
          ph.created_by,
          ph.updated_by,
          c.category_id,
          c.name AS category,
          concat_ws(' ', coalesce(ph.name, ' '), coalesce(ph.description, ' '), coalesce(c.name, ' ')) AS filter
        FROM 
          product_header ph
          LEFT JOIN category c ON ph.category_id = c.category_id
      ) subquery
      WHERE
        ${whereClause}
      ORDER BY
        product_id ASC
    `

    const [data = [], metadata] = await paginatedQuery<ProductHeader>(
      statement,
      query,
      parameters
    )

    if (!data.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }

  async getProducts(
    conditions: AdvancedCondition[],
    query: QueryParams
  ): Promise<ApiResponse<ProductDetail[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      SELECT 
        *
      FROM (
        SELECT 
          ph.product_id,
          ph.name,
          ph.description,
          pd.state,
          pd.model,
          pd.brand,
          pd.price,
          pd.stock,
          pd.supplier,
          pd.product_detail_id,
          pd.created_at,
          pd.created_by,
          pd.updated_at,
          pd.updated_by,
          pd.condition,
          c.category_id,
          c.name AS category_name,
          concat_ws(
            coalesce(ph.name, ' '),
            coalesce(ph.description, ' '), 
            coalesce(c.name, ' '),
            coalesce(pd.model, ' '),
            coalesce(pd.brand, ' '),
            coalesce(pd.supplier, ' ')
          ) AS filter
        FROM 
          product_detail pd
          INNER JOIN product_header ph ON pd.product_id = ph.product_id
          LEFT JOIN category c ON ph.category_id = c.category_id
      ) subquery
      WHERE
        ${whereClause}
      ORDER BY
        product_detail_id ASC
    `

    const [data = [], metadata] = await paginatedQuery<ProductDetail>(
      statement,
      query,
      parameters
    )

    if (!data.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }
}
