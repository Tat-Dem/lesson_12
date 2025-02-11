export class OrderDto {
  status: string | undefined
  courierId: number | undefined
  customerName: string | undefined
  customerPhone: string | undefined
  comment: string | undefined
  orderId: number | undefined

  constructor(
    status: string | undefined,
    customerName: string,
    customerPhone: string,
    comment: string,
    orderId?: number,
    courierId?: number,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.orderId = orderId
  }

  static generateRandomOrderDto(): OrderDto {
    return new OrderDto(
      'OPEN',
      'David',
      `4852345235${Math.floor(Math.random() * 10)}`,
      'no comment',
    )
  }

  static generateOrderDtoWithoutStatus(): OrderDto {
    return new OrderDto(undefined, 'David', '4852345235', 'no comment')
  }

  static generateEmptyOrderDto(): any {
    return {}
  }

  static serializeResponse(json: any): OrderDto {
    return new OrderDto(
      json.status,
      json.customerName,
      json.customerPhone,
      json.comment,
      json.orderId,
      json.courierId,
    )
  }
}
