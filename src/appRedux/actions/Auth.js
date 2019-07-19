import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET
} from "../../constants/ActionTypes";
import axios from 'axios';
const baseURL = 'http://74.127.61.115:9900/graphql';
export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const userSignUp = ({email, password, name}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post(baseURL,{
      variables:{ 
        email: email,
        password: password,
        username: name
      },
      query:`
        mutation createUser($username: String!, $email: String!, $password: String!) {
          signUp(username: $username, email: $email, password: $password) {
            token
          } 
        }
      `
    }).then(({data}) => {
      if (data.data) {
        localStorage.setItem("token", data.data.signUp.token);
        axios.defaults.headers.common['x-token'] = data.data.signUp.token;
        axios.defaults.headers.common['token'] = data.data.signUp.token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.data.signUp.token});
      } else {
        console.log("payload: data.error", data);
        dispatch({type: FETCH_ERROR, payload: "Network Error"});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};
export const userSignIn = ({username, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post(baseURL,{ 
        variables:{
          username:username,
          password:password
        },
          query:`
            mutation signUserIn($username: String!, $password: String!){
              signIn(login: $username, password: $password) {
                token
              }
            }
          `
      }
    ).then(({data}) => {
      console.log(data.data)
      if (data.data) {
        localStorage.setItem("token", data.data.signIn.token);
        axios.defaults.headers.common['x-token'] = data.data.signIn.token;
        axios.defaults.headers.common['token'] = data.data.signIn.token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.data.signIn.token});
        this.props.history.push('/')
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error);
    });
  }
};

export const getUser = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('auth/me',
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data.result) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_DATA, payload: data.user});
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};


export const userSignOut = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    setTimeout(() => {
      localStorage.removeItem("token");
      dispatch({type: FETCH_SUCCESS});
      dispatch({type: SIGNOUT_USER_SUCCESS});
    }, 2000);
  }
};
