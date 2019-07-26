import axios, { apiUrl } from '../util/Api';
import queries from './queries';

export class UserService {
  static async getUsers() {
    try {
      const users = await axios.post(apiUrl, {
        query: queries.GET_USERS
      });
      return users.data;
    } catch (error) {
      throw new Error("Ha ocurrido un error al solicitar los usuarios.");
    }
  }
}

export class CountryService {
  static async getCountries(cursor = null, limit = 100) {
    try {
      const countries = await axios.post(apiUrl, {
        query: queries.GET_COUNTRIES,
        variables: {
          cursor,
          limit
        }
      });
      return countries.data.data.countries;
    } catch (error) {
      throw new Error("Ha ocurrido un error al solicitar los paises.");
    }
  }
}