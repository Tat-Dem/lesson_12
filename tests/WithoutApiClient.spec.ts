import { expect, test } from '@playwright/test'
import { LoginDTO } from './DTO/LoginDTO'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './DTO/OrderDto'

test.describe('Login tests', async () => {
  test('TL-12-1 Successful authorization,order creation and search', async ({ request }) => {
    const responseLogin = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log(await responseLogin.text())
    expect(responseLogin.status()).toBe(StatusCodes.OK)

    const orderData = OrderDto.generateRandomOrderDto()

    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: orderData,
      headers: {
        Authorization: ' Bearer ' + (await responseLogin.text()),
      },
    })

    console.log(await responseCreateOrder.text())
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)

    const createOrder = await responseCreateOrder.json()
    const orderId: string = createOrder.id
    console.log('Created Order Id:', orderId)

    const responseSearchOrder = await request.get(
      `https://backend.tallinn-learning.ee/orders/${orderId}`,
      {
        headers: {
          Authorization: ' Bearer ' + (await responseLogin.text()),
        },
      },
    )
    console.log(await responseSearchOrder.text())
    expect(responseSearchOrder.status()).toBe(StatusCodes.OK)

    const foundOrder = await responseSearchOrder.json()
    expect(foundOrder.id).toBe(orderId)
  })
  test('TL-12-2 Authorization and order deletion by ID', async ({ request }) => {
    const responseLogin = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })
    console.log(await responseLogin.text())
    expect(responseLogin.status()).toBe(StatusCodes.OK)

    const orderData = OrderDto.generateRandomOrderDto()
    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: orderData,
      headers: {
        Authorization: ' Bearer ' + (await responseLogin.text()),
      },
    })
    console.log(await responseCreateOrder.text())
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)

    const createdOrder = await responseCreateOrder.json()
    const orderId: string = createdOrder.id
    console.log('Created Order ID:', orderId)
    expect(orderId).toBeDefined()

    const responseDeleteOrder = await request.delete(
      `https://backend.tallinn-learning.ee/orders/${orderId}`,
      {
        headers: {
          Authorization: 'Bearer ' + (await responseLogin.text()),
        },
      },
    )

    console.log(await responseDeleteOrder.text())
    expect(responseDeleteOrder.status()).toBe(StatusCodes.OK)

    const responseSearchOrderAfterDeletion = await request.get(
      `https://backend.tallinn-learning.ee/orders/${orderId}`,
      {
        headers: {
          Authorization: 'Bearer ' + (await responseLogin.text()),
        },
      },
    )

    expect(responseSearchOrderAfterDeletion.status()).toBe(StatusCodes.OK)
  })
})
