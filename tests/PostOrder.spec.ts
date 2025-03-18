import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './DTO/OrderDto'

test('123 post order with correct data should receive code 201', async ({ request }) => {
  // Send a POST request to the server
  const response = await request.post(`https://backend.tallinn-learning.ee/test-orders`, {
    data: OrderDto.generateRandomOrderDto(),
  })

  const responseBody = OrderDto.serializeResponse(await response.json())

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.status).toBe('OPEN')
})

test('post order with data without status field should receive code 200', async ({ request }) => {
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: OrderDto.generateOrderDtoWithoutStatus(),
  })
  const responseBody = await response.json()

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect.soft(responseBody.status).toBe(null)
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('post order with empty data should receive code 200', async ({ request }) => {
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: OrderDto.generateEmptyOrderDto(),
  })
  const responseBody = await response.json()

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.status).toBeNull()
})
