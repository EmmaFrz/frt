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
      throw new Error("Ha ocurrido un error al consultar los usuarios.");
    }
  }

}

export class CurrencyService {

  static async getCurrencies(cursor = null, limit = 100) {
    try {
      const result = await axios.post(apiUrl, {
        query: queries.GET_CURRENCIES,
        variables: {
          cursor,
          limit
        }
      });
      return result.data;
    } catch (error) {
      throw new Error("Ha ocurrido un error al consultar divisas.");
    }
  }

}

export class BranchOfficeService {

  static async getBranchOffices(cursor = null, limit = 100, country = null, state = null){
    try {
      const branchOffices = await axios.post(apiUrl, {
        query: queries.GET_BRANCH_OFFICES,
        variables: {
          cursor,
          limit,
          country,
          state
        }
      });
      return branchOffices.data;
    } catch (error) {
      throw new Error("Ha ocurrido un error al consultar sucursales.");
    }
  }

}

export class BankCountryService {

  static async getBanks(cursor = null, limit = 100, country = null) {
    try {
      const banks = await axios.post(apiUrl, {
        query: queries.GET_BANKS,
        variables: {
          cursor,
          limit,
          country
        }
      });
      return banks.data;
    } catch (error) {
      throw new Error("Ha ocurrido un error al consultar divisas.");
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
      throw new Error("Ha ocurrido un error al consultar los paises.");
    }
  }

}
