import axios, { apiUrl } from '../util/Api';
import queries from './queries';

class UserService {

  static async getUsers() {

    try {
      const users = await axios.post(apiUrl, {
        query: queries.GET_USERS
      });
      return users.data;
    } catch (error) {
      return false;
    }

  }

}

export default UserService;