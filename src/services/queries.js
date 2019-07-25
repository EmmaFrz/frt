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
  `,
  GET_COUNTRIES: `
    query getAllCountries($cursor: String, $limit: Int) {
      countries(cursor: $cursor, limit: $limit){
        edges{
          name,
          currency{
            name,
            short,
            id
          },
          states
        },
        pageInfo{
          hasNextPage,
          endCursor
        }
      }

    }
  `
};