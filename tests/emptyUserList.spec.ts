import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { UserDTO } from './DTO/UserDTO'

test.describe('TL-14-5 get all users returns empty array test', () => {
  test.beforeEach(async ({ request }) => {
    const allUsersResponse = await request.get('http://localhost:3000/users')
    const users: UserDTO[] = await allUsersResponse.json()
    for (const user of users) {
      await request.delete(`http://localhost:3000/users/${user.id}`)
    }
  })

  test('get all users returns empty array test', async ({ request }) => {
    const allUsersResponse = await request.get('http://localhost:3000/users')
    expect(allUsersResponse.status()).toBe(StatusCodes.OK)
    const json: UserDTO[] = await allUsersResponse.json()
    expect(json).toEqual([])
  })
})
