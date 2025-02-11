import {APIRequestContext} from 'playwright'
import { LoginDTO } from '../tests/DTO/LoginDTO'
import { StatusCodes } from 'http-status-codes'
import { OrderDto} from '../tests/DTO/OrderDto'

const serverURL = "https://backend.tallinn-learnin.ee";
const loginPath = "login/student";
const orderPath = "orders";


export class ApiClient {
  static instance: ApiClient;
  private request: APIRequestContext
  jwt: string = "";

  private constructor( request: APIRequestContext) {
    this.request = request;
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if(!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request);
      await ApiClient.instance.requestJwt();
    }

    return ApiClient.instance;
  }

  async requestJwt(): Promise<void> {
    console.log("Requesting JWT");
    const responseLogin = await this.request.post (`${serverURL}${loginPath}`, {
      data: LoginDTO.createLoginWithCorrectData(),
    });

    if (responseLogin.status() !== StatusCodes.OK) {
      throw new Error(`Authorization failed: ${responseLogin.status()}`);
    }

    this.jwt = await responseLogin.text();
    console.log(`JWT received: ${this.jwt}`);
  }

  private getHeaders(){
    return{
      Authorization: `Bearer ${this.jwt}`,
      'Content-Type': 'application/json'
    };
  }
  public async createOrder(): Promise<{ id: string, orderData: any}>{
    const orderData = OrderDto.generateRandomOrderDto();
    const response = await this.request.post(`${serverURL}${orderPath}`, {
      data: orderData,
      headers: this.getHeaders(),
    });

    if (response.status() !== StatusCodes.OK){
      throw new Error(`Failed to create order: ${response.status()}`);
    }
    const { id } = await response.json();
    return {id, orderData};
  }
  public async getOrderById(orderId: string): Promise<any> {
    console.log(`Searching for order: ${orderId}`);
    const response = await this.request.get(`https://backend.tallinn-learning.ee/orders/${orderId}`, {
      headers: this.getHeaders(),
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Failed to fetch order: ${response.status()}`);
    }

    return response.json();
  }

  public async deleteOrder(orderId: string): Promise<void> {
    console.log(`Deleting order: ${orderId}`);
    const response = await this.request.delete(`https://backend.tallinn-learning.ee/orders/${orderId}`, {
      headers: this.getHeaders(),
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Failed to delete order: ${response.status()}`);
    }

    console.log(`Order ${orderId} deleted successfully.`);
  }
}
