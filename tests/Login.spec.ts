import { expect, test } from '@playwright/test'
import { LoginDTO } from './DTO/LoginDTO'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './DTO/OrderDto'

test.describe('Login tests', async () => {
  test('TL-12-1 Successful authorization', async ({ request }) => {
    const response = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log(await response.text())
    expect(response.status()).toBe(StatusCodes.OK)
  })

  test('TL-12-2 Successful authorization and order creation', async ({ request }) => {
    const responseLogin = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log(await responseLogin.text())
    expect(responseLogin.status()).toBe(StatusCodes.OK)

    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + (await responseLogin.text()),
      },
    })
    console.log(await responseCreateOrder.text())
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
  })
  test('TL-12-3 Successful authorization, order creation and order status', async ({ request }) => {
    const responseLogin = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })
    expect(responseLogin.status()).toBe(StatusCodes.OK)


    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + (await responseLogin.text()),
      },
    })
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)

    const createOrderResponse = await responseCreateOrder.json();
    expect(createOrderResponse.id).toBeDefined()
    expect(createOrderResponse.id).toBeGreaterThan(0)

    const responseOrderStatusStatus = await request.get(
      `http://backend.tallinn-learning.ee/orders/${createOrderResponse.id}`,
      {
        headers: {
          Authorization: 'Bearer ' + (await responseLogin.text()),
        },
      },
    )
    expect(responseOrderStatusStatus.status()).toBe(StatusCodes.OK)
    const requestedOrder = OrderDto.serializeResponse(await responseOrderStatusStatus.json())
    expect(requestedOrder.status).toBeDefined()
    expect(requestedOrder.status).toBe('OPEN')
  })
})
