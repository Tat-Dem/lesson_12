import { APIRequestContext } from 'playwright'
import { expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { UserDTO } from '../tests/DTO/UserDTO'

const baseUrl = 'http://localhost:3000'
const userPath = 'users'

export class ApiClientUser {
  private request: APIRequestContext

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async createUserAndReturnUserId(
    userData: Omit<UserDTO, 'id' | 'phone'> = { name: 'Test User', email: 'test@example.com' },
  ): Promise<UserDTO> {
    const response = await this.request.post(`${baseUrl}/${userPath}`, { data: userData })

    expect(response.status()).toBe(StatusCodes.CREATED)

    return UserDTO.serializeResponse(await response.json())
  }

  async deleteUser(userId: number): Promise<UserDTO> {
    const response = await this.request.delete(`${baseUrl}/${userPath}/${userId}`)

    expect(response.status()).toBe(StatusCodes.OK)

    return UserDTO.serializeResponse(await response.json())
  }

  async deleteAllUsers(): Promise<void> {
    const allUsers = await this.searchUsers()
    await Promise.all(allUsers.map((user) => this.deleteUser(user.id)))
  }

  async searchUser(userId: number): Promise<UserDTO> {
    const response = await this.request.get(`${baseUrl}/${userPath}/${userId}`)

    expect(response.status()).toBe(StatusCodes.OK)

    return UserDTO.serializeResponse(await response.json())
  }

  async searchUsers(): Promise<UserDTO[]> {
    const response = await this.request.get(`${baseUrl}/${userPath}`)

    expect(response.status()).toBe(StatusCodes.OK)

    const users: UserDTO[] = (await response.json()).map((user: any) =>
      UserDTO.serializeResponse(user),
    )

    return users
  }
}
