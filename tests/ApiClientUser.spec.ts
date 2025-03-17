import { expect, test, APIRequestContext } from '@playwright/test'
import { ApiClientUser } from '../api/ApiClientUser'
import { UserDTO } from './DTO/UserDTO'

test.describe('User management app tests with API client', () => {
  let apiClient: ApiClientUser
  let requestContext: APIRequestContext

  test.beforeEach(async ({ request }) => {
    requestContext = request
    apiClient = new ApiClientUser(requestContext)
    await apiClient.deleteAllUsers()
  })

  test('TL-14 get all users returns empty array test', async () => {
    const allUsers = await apiClient.searchUsers()
    expect(allUsers.length).toBe(0)
  })

  test('TL-14-1 create user test with Api client', async () => {
    const newUser = await apiClient.createUserAndReturnUserId()
    expect(newUser).toBeDefined()
    expect(newUser).toBeInstanceOf(UserDTO)
  })

  test('TL-14-2 find user test with API client', async () => {
    const createdUser = await apiClient.createUserAndReturnUserId()
    const foundUser = await apiClient.searchUser(createdUser.id)

    expect(foundUser).toStrictEqual(createdUser)
  })

  test('TL-14-3 delete user test with API client', async () => {
    const createdUser = await apiClient.createUserAndReturnUserId()
    const deletedUser = await apiClient.deleteUser(createdUser.id)
    expect(deletedUser).toStrictEqual(createdUser)

    const userAfterDelete = await apiClient.searchUser(createdUser.id)
    expect(userAfterDelete).toBeNull()
  })

  test('TL-14-4 get all users test with API client', async () => {
    const userCount = 3
    for (let i = 0; i < userCount; i++) {
      await apiClient.createUserAndReturnUserId()
    }

    const allUsers = await apiClient.searchUsers()
    expect(allUsers.length).toBe(userCount)
  })

  test('Check that created user has data from request', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }
    const createdUser = await apiClient.createUserAndReturnUserId(userData)
    expect(createdUser.name).toBe(userData.name)
    expect(createdUser.email).toBe(userData.email)
  })
})
