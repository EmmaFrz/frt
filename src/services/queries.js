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
  `,
  GET_ORDERS: `
  query getOrders($cursor: String, $limit: Int, $country: ID, $branchOffice: ID, $status: String ) {
    orders(cursor: $cursor, limit: $limit, country: $country, branchOffice: $branchOffice, status: $status){
      edges {
        id,
        sender {
          id
          email
          phone
          dni
        },
        receiver_dni,
        receiver_phone,
        status,
        origin_country {
          id
          name
          alpha2code
          currency {
            id
            name
            short
          }
        },
        destination_country {
          id
          name
          alpha2code
          currency {
            id
            name
            short
          }
        },
        origin_bank{
          id,
          name
        },
        destination_bank{
          id,
          name
        },
        order_number,
        amount,
        destination_amount,
        createdAt
      },
      pageInfo{
        hasNextPage,
        endCursor
      }
    }
  }
`

};