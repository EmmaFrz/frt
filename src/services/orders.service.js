import axios, { apiUrl } from '../util/Api';
import queries from './queries';

export class OrderService {

  static async getOrders(cursor = null, limit = 100, country = null, branchOffice = null, status = 'PENDING') {
    try {
      const orders = await axios.post(apiUrl, {
        query: queries.GET_ORDERS,
        variables: {
          cursor,
          limit,
          country,
          branchOffice,
          status
        }
      });
      if (!orders.data) {
        console.log(orders.errors);
        throw new Error("Ha ocurrido un error al solicitar las transacciones.");
      }
      return orders.data.data.orders;
    } catch (error) {
      throw new Error("Ha ocurrido un error al solicitar las transacciones.");
    }
  }

}
