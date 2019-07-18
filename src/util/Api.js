import axios from 'axios';

export default axios.create({
  baseURL: 'http://74.127.61.115:9900/graphql',
  headers: {
    'Content-Type': 'application/json',
  }
});
