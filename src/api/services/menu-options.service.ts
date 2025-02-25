import { AppDataSource } from '../../config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from '../../constants/status-codes'
import { MenuOption } from '../../entities/MenuOption'
import { User } from '../../entities/User'
import { ApiResponse } from '../../types/api.types'
import { DeepPartial } from 'typeorm'

export interface CreateMenuOptionPayload {
  name: string
  path: string
  description: string
  type: string
  icon: string
  parent_id: DeepPartial<MenuOption>
  content: string
  created_by: number
}

export interface MenuTree {
  title: string
  key: string
  children: MenuTree[]
}

export class MenuOptionService {
  private menuOptionRepository = AppDataSource.getRepository(MenuOption)
  private userRepository = AppDataSource.getRepository(User)

  /**
   * Create a menu option.
   * @param optionData - Menu option data
   * @return The option created
   */
  async create({
    created_by,
    parent_id,
    ...optionData
  }: CreateMenuOptionPayload): Promise<ApiResponse<MenuOption>> {
    let parentOption: MenuOption = null

    let user = await this.userRepository.findOneBy({ user_id: created_by })

    if (!user) {
      throw new Error('no user found')
    }

    if (parent_id) {
      parentOption = await this.menuOptionRepository.findOneBy({
        menu_option_id: parent_id as never,
      })
    }

    const option = this.menuOptionRepository.create({
      ...optionData,
      [created_by]: user || null,
      parent: parentOption || null,
    })

    await this.menuOptionRepository.save(option)

    return { message: 'Menu option created successfully.' }
  }

  /**
   * Get the menu option list
   * @param username - the name of the current user
   * @return - The user menu option
   */
  async getMenuOptions(username: string): Promise<ApiResponse<MenuOption[]>> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    })

    if (!user) throw new Error('Usuario no encontrado')

    const roleIds = user.roles.map((role) => role.role_id)

    const menuOptions = await this.menuOptionRepository
      .createQueryBuilder('menu_option')
      .leftJoinAndSelect('menu_option.roles', 'role')
      .leftJoinAndSelect('menu_option.parent', 'parent')
      .where('role.role_id IN (:...roleIds)', { roleIds })
      .andWhere('menu_option.state = :active', { active: 'A' })
      .getMany()

    const menuMap = new Map<string, MenuOption>(
      menuOptions.map((menu) => {
        type MenuOptionWithChildren = MenuOption & { children: MenuOption[] }
        const menuCopy = { ...menu, children: [] } as MenuOptionWithChildren
        delete menuCopy.roles
        return [menu.menu_option_id, menuCopy]
      })
    )

    const menuTree: MenuOption[] = []

    menuOptions.forEach((menu) => {
      if (menu.parent) {
        const parent = menuMap.get(menu.parent?.menu_option_id)
        if (parent) {
          const children = menuMap.get(menu.menu_option_id)
          if (children) {
            delete children.parent
            parent['children'].push(children)
          } else {
            delete parent['children']
          }
        }
      } else {
        menuTree.push(menuMap.get(menu.menu_option_id)!)
      }
    })

    if (!menuTree.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data: menuTree }
  }

  /**
   * Get all active menu options
   * @return - The list of active menu options
   */
  async getAllMenuOptions(): Promise<ApiResponse<MenuTree[]>> {
    const menuOptions = await this.menuOptionRepository
      .createQueryBuilder('menu_option')
      .leftJoinAndSelect('menu_option.parent', 'parent')
      .where('menu_option.state = :active', { active: 'A' })
      .getMany()

    const buildMenuTree = (menuOptions: MenuOption[]): MenuTree[] => {
      const menuMap: Map<string, MenuTree> = new Map()
      const roots: MenuTree[] = []

      menuOptions.forEach((option) => {
        menuMap.set(option.menu_option_id, {
          title: option.name,
          key: option.menu_option_id,
          children: [],
        })
      })

      menuOptions.forEach((option) => {
        const node = menuMap.get(option.menu_option_id)!

        if (option.parent) {
          const parent = menuMap.get(option.parent.menu_option_id)
          if (parent) {
            parent.children.push(node)
          }
        } else {
          roots.push(node)
        }
      })

      return roots
    }

    const menuTree = buildMenuTree(menuOptions)

    if (!menuTree.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data: menuTree }
  }
}
