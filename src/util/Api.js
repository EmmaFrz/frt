import axios from 'axios';

export const apiUrl = 'http://74.127.61.115:9900/graphql';

export default axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});