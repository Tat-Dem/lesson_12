import { expect, test } from '@playwright/test'
import { ApiClient } from '../api/ApiClient'
import { StatusCodes } from 'http-status-codes'

test.describe('Api Client', async () => {
  test('TL-12-1.1 Authorization, order creation and search', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    await apiClient.requestJwt()

    const { id: orderId, orderData } = await apiClient.createOrder()
    console.log(`Created Order ID: ${orderId}`)

    const expectedOrder = {
      ...orderData,
      courierId: null,
      id: orderId,
    }

    const foundOrder = await apiClient.getOrderById(orderId)
    console.log('Found Order:', foundOrder)

    expect(foundOrder).toEqual(expectedOrder)
  })

  test('TL-12-2.1 Authorization and order deletion by ID', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)

    const { id: orderId } = await apiClient.createOrder()
    console.log(`Created Order ID: ${orderId}`)

    await apiClient.deleteOrder(orderId)

    const response = await request.get(`https://backend.tallinn-learning.ee/orders/${orderId}`, {
      headers: { Authorization: ` Bearer ${apiClient.jwt}` },
    })
    expect(response.status()).toBe(StatusCodes.OK)
  })
})
