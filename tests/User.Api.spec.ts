import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { UserDTO } from './DTO/UserDTO'
import { APIRequestContext } from 'playwright'

test.describe('User management app tests', async () => {
  const clearUser = async (id: number, request: APIRequestContext): Promise<void> => {
    await request.delete(`http://localhost:3000/users/${id}`)
  }


  test('TL-14-1 create user test', async ({ request }) => {
    const creationResponse = await request.post('http://localhost:3000/users')
    expect(creationResponse.status()).toBe(StatusCodes.CREATED)
    const createdUser = UserDTO.serializeResponse(await creationResponse.json())
    expect(createdUser.id).toBeDefined()
    await clearUser(createdUser.id, request)
  })

  test('TL-14-2 find user test', async ({ request }) => {
    const creationResponse = await request.post('http://localhost:3000/users')
    const createdUser = UserDTO.serializeResponse(await creationResponse.json())
    const searchResponse = await request.get(`http://localhost:3000/users/${createdUser.id}`)
    const foundUser = UserDTO.serializeResponse(await searchResponse.json())

    expect(foundUser).toStrictEqual(createdUser)

    await clearUser(createdUser.id, request)
  })

  test('TL-14-3 delete user test', async ({ request }) => {
    const creationResponse = await request.post('http://localhost:3000/users')
    const createdUser = UserDTO.serializeResponse(await creationResponse.json())
    const deleteResponse = await request.delete(`http://localhost:3000/users/${createdUser.id}`)
    const deletedUser = UserDTO.serializeResponse((await deleteResponse.json())[0])

    expect(deletedUser).toStrictEqual(createdUser)
  })

  test('TL-14-4 get all users test', async ({ request }) => {
    await request.post('http://localhost:3000/users')
    await request.post('http://localhost:3000/users')
    await request.post('http://localhost:3000/users')
    const allUsersResponse = await request.get('http://localhost:3000/users')
    const json: UserDTO[] = await allUsersResponse.json()


    expect(json.length).toBe(3)
  })
})