import axios from 'axios';

export const apiUrl = 'http://localhost:8000/graphql';

export default axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});