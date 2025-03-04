import { expect, test } from '@playwright/test'
import { OrderDto } from './DTO/OrderDto'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  // Log the response status, body and headers
  const responseBody = OrderDto.serializeResponse(await response.json())
  console.log('response body:', responseBody)
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect.soft(response.status()).toBe(200)
  expect.soft(responseBody.courierId).toBeDefined()
  expect.soft(responseBody.status).toBe('OPEN')
})

test('get order with id = 0', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

test('get order with id equal %', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/%')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

test('get order with id = first and get 400 error', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/first')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

test('get order with empty id and get 500 error', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 500
  expect(response.status()).toBe(500)
})
