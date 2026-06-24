// import Apis from '@/api'

/**
 * Pet模块演示
 * 演示宠物相关API的使用
 */
export class PetDemo {
  // 获取所有可用的宠物
  static async getAvailablePets() {
    console.log('=== 获取可用宠物 ===')
    try {
      const pets = await Apis.pet
        .findPetsByStatus({
          params: { status: 'available' },
        })
        .send()
      console.log('可用宠物列表:', pets)
      return pets
    } catch (error) {
      console.error('获取宠物失败:', error)
    }
  }

  // 获取特定宠物信息
  static async getPetById(petId: number) {
    console.log(`=== 获取宠物 ${petId} 的信息 ===`)
    try {
      const pet = await Apis.pet
        .getPetById({
          pathParams: { petId },
        })
        .send()
      console.log('宠物信息:', pet)
      return pet
    } catch (error) {
      console.error('获取宠物信息失败:', error)
    }
  }

  // 添加新宠物
  static async addNewPet() {
    console.log('=== 添加新宠物 ===')
    try {
      const newPet = await Apis.pet
        .addPet({
          data: {
            name: 'Buddy',
            category: { id: 1, name: 'Dogs' },
            status: 'available',
            photoUrls: ['https://example.com/buddy.jpg'],
            tags: [
              { id: 1, name: 'friendly' },
              { id: 2, name: 'trained' },
            ],
          },
        })
        .send()
      console.log('新添加的宠物:', newPet)
      return newPet
    } catch (error) {
      console.error('添加宠物失败:', error)
    }
  }

  // 测试宠物不存在的情况
  static async testPetNotFound() {
    console.log('=== 测试宠物不存在的情况 ===')
    try {
      await Apis.pet
        .getPetById({
          pathParams: { petId: 404 },
        })
        .send()
    } catch (error) {
      console.log('预期的404错误:', error)
    }
  }

  // 删除宠物（需要API密钥）
  static async deletePet(petId: number, apiKey: string = 'special-key') {
    console.log(`=== 删除宠物 ${petId} ===`)
    try {
      const result = await Apis.pet
        .deletePet({
          pathParams: { petId },
          headers: { api_key: apiKey },
        })
        .send()
      console.log('删除结果:', result)
      return result
    } catch (error) {
      console.error('删除宠物失败:', error)
    }
  }
}

/**
 * Store模块演示
 * 演示商店相关API的使用
 */
export class StoreDemo {
  // 获取库存信息
  static async getInventory() {
    console.log('=== 获取库存信息 ===')
    try {
      const inventory = await Apis.store.getInventory().send()
      console.log('库存信息:', inventory)
      return inventory
    } catch (error) {
      console.error('获取库存失败:', error)
    }
  }

  // 下单购买宠物
  static async placeOrder(petId: number, quantity: number = 1) {
    console.log('=== 下单购买宠物 ===')
    try {
      const order = await Apis.store
        .placeOrder({
          data: {
            petId,
            quantity,
            shipDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后发货
            status: 'placed',
            complete: false,
          },
        })
        .send()
      console.log('订单信息:', order)
      return order
    } catch (error) {
      console.error('下单失败:', error)
    }
  }

  // 获取订单信息
  static async getOrderById(orderId: number) {
    console.log(`=== 获取订单 ${orderId} 信息 ===`)
    try {
      const order = await Apis.store
        .getOrderById({
          pathParams: { orderId },
        })
        .send()
      console.log('订单详情:', order)
      return order
    } catch (error) {
      console.error('获取订单失败:', error)
    }
  }

  // 测试无效订单ID
  static async testInvalidOrderId() {
    console.log('=== 测试无效订单ID ===')
    try {
      await Apis.store
        .getOrderById({
          pathParams: { orderId: 999 },
        })
        .send()
    } catch (error) {
      console.log('预期的400错误:', error)
    }
  }

  // 删除订单
  static async deleteOrder(orderId: number) {
    console.log(`=== 删除订单 ${orderId} ===`)
    try {
      const result = await Apis.store
        .deleteOrder({
          pathParams: { orderId },
        })
        .send()
      console.log('删除结果:', result)
      return result
    } catch (error) {
      console.error('删除订单失败:', error)
    }
  }
}

/**
 * User模块演示
 * 演示用户相关API的使用
 */
export class UserDemo {
  // 用户登录
  static async login(username: string = 'admin', password: string = 'admin') {
    console.log('=== 用户登录 ===')
    try {
      const loginResult = await Apis.user
        .loginUser({
          params: { username, password },
        })
        .send()
      console.log('登录结果:', loginResult)
      return loginResult
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  // 获取用户信息
  static async getUserInfo(username: string) {
    console.log(`=== 获取用户 ${username} 信息 ===`)
    try {
      const user = await Apis.user
        .getUserByName({
          pathParams: { username },
        })
        .send()
      console.log('用户信息:', user)
      return user
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 创建新用户
  static async createUser(userData: any = {}) {
    console.log('=== 创建新用户 ===')
    try {
      const newUser = await Apis.user
        .createUser({
          data: {
            username: 'newuser',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            phone: '1234567890',
            userStatus: 1,
            ...userData,
          },
        })
        .send()
      console.log('新用户:', newUser)
      return newUser
    } catch (error) {
      console.error('创建用户失败:', error)
    }
  }

  // 更新用户信息
  static async updateUser(username: string, updateData: any) {
    console.log(`=== 更新用户 ${username} 信息 ===`)
    try {
      const updatedUser = await Apis.user
        .updateUser({
          pathParams: { username },
          data: updateData,
        })
        .send()
      console.log('更新后的用户:', updatedUser)
      return updatedUser
    } catch (error) {
      console.error('更新用户失败:', error)
    }
  }

  // 测试用户不存在的情况
  static async testUserNotFound() {
    console.log('=== 测试用户不存在的情况 ===')
    try {
      await Apis.user
        .getUserByName({
          pathParams: { username: 'notfound' },
        })
        .send()
    } catch (error) {
      console.log('预期的404错误:', error)
    }
  }

  // 批量创建用户
  static async createUsersWithArray() {
    console.log('=== 批量创建用户（数组） ===')
    try {
      const result = await Apis.user
        .createUsersWithListInput({
          data: [
            {
              username: 'user1',
              firstName: 'User',
              lastName: 'One',
              email: 'user1@example.com',
              password: 'password',
              phone: '1111111111',
              userStatus: 1,
            },
            {
              username: 'user2',
              firstName: 'User',
              lastName: 'Two',
              email: 'user2@example.com',
              password: 'password',
              phone: '2222222222',
              userStatus: 1,
            },
          ],
        })
        .send()
      console.log('批量创建结果:', result)
      return result
    } catch (error) {
      console.error('批量创建用户失败:', error)
    }
  }

  // 用户登出
  static async logout() {
    console.log('=== 用户登出 ===')
    try {
      const result = await Apis.user.logoutUser().send()
      console.log('登出结果:', result)
      return result
    } catch (error) {
      console.error('登出失败:', error)
    }
  }
}

/**
 * 综合演示
 * 演示完整的业务流程
 */
export class FullDemo {
  // 完整的宠物商店购买流程
  static async completePetStorePurchaseFlow() {
    console.log('\n🎯 开始完整的宠物商店购买流程演示\n')

    // 1. 用户登录
    const loginResult = await UserDemo.login('admin', 'admin')
    if (!loginResult) return

    // 2. 查看库存
    const inventory = await StoreDemo.getInventory()
    console.log('\n📦 当前库存状态:', inventory)

    // 3. 浏览可用宠物
    const availablePets = await PetDemo.getAvailablePets()
    if (!availablePets || availablePets.length === 0) {
      console.log('❌ 没有可用的宠物')
      return
    }

    // 4. 选择第一个宠物
    const selectedPet = availablePets[0]
    console.log('\n🐕 选择的宠物:', selectedPet)

    // 5. 查看宠物详情
    if (selectedPet?.id) {
      await PetDemo.getPetById(selectedPet.id)
    }

    // 6. 下单购买
    const order = selectedPet?.id ? await StoreDemo.placeOrder(selectedPet.id, 1) : null
    if (!order) return

    // 7. 查看订单详情
    if (order?.id) {
      await StoreDemo.getOrderById(order.id)
    }

    // 8. 获取用户信息
    await UserDemo.getUserInfo('admin')

    console.log('\n✅ 完整流程演示结束')
  }

  // 错误处理演示
  static async errorHandlingDemo() {
    console.log('\n⚠️ 开始错误处理演示\n')

    // 测试各种错误情况
    await PetDemo.testPetNotFound()
    await StoreDemo.testInvalidOrderId()
    await UserDemo.testUserNotFound()

    console.log('\n✅ 错误处理演示结束')
  }

  // CRUD操作演示
  static async crudDemo() {
    console.log('\n🔄 开始CRUD操作演示\n')

    // 创建
    const newPet = await PetDemo.addNewPet()
    const newUser = await UserDemo.createUser({ username: 'testuser' })

    // 读取
    if (newPet?.id) await PetDemo.getPetById(newPet.id)
    if (newUser) await UserDemo.getUserInfo('testuser')

    // 更新
    if (newUser) {
      await UserDemo.updateUser('testuser', {
        firstName: 'Updated',
        lastName: 'User',
      })
    }

    // 删除
    if (newPet?.id) await PetDemo.deletePet(newPet.id)

    console.log('\n✅ CRUD操作演示结束')
  }
}

// 导出演示运行器
export async function runMockDemo() {
  console.log('🚀 开始Mock数据演示\n')

  try {
    // 运行完整流程演示
    await FullDemo.completePetStorePurchaseFlow()

    // 运行错误处理演示
    await FullDemo.errorHandlingDemo()

    // 运行CRUD演示
    await FullDemo.crudDemo()

    console.log('\n🎉 所有演示完成!')
  } catch (error) {
    console.error('演示过程中发生错误:', error)
  }
}

// 如果直接运行此文件，执行演示
if (typeof window !== 'undefined') {
  // 在浏览器环境中，可以在控制台调用
  ;(window as any).runMockDemo = runMockDemo
  ;(window as any).PetDemo = PetDemo
  ;(window as any).StoreDemo = StoreDemo
  ;(window as any).UserDemo = UserDemo
  console.log('Mock演示函数已加载到全局对象，可在控制台调用：')
  console.log('- runMockDemo() - 运行完整演示')
  console.log('- PetDemo.* - 宠物模块演示')
  console.log('- StoreDemo.* - 商店模块演示')
  console.log('- UserDemo.* - 用户模块演示')
}
