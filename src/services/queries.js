export default {
  GET_USERS: `
    query getUsers{
      users{
        username,
        email,
        role,
        phone,
        dni
      }
    }
  `
};