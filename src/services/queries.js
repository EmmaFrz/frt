const pageInfo = `
  pageInfo{
    hasNextPage,
    endCursor
  }
`;

export default {
  GET_BANKS: `
    query getBanks($cursor: String, $limit: Int, $country: ID){
      banks(cursor: $cursor, limit: $limit, country: $country){
        edges{
          id,
          name,
          country{
            id,
            name,
            alpha2code
          }
        },
        ${pageInfo}
      }
    }
  `,
  GET_BRANCH_OFFICES: `
    query getBranchOffices($cursor: String, $limit: Int, $country: ID, $state: String){
      branchOffices(cursor: $cursor, limit: $limit, country: $country, state: $state){
        edges{
          id,
          name,
          country{
            id,
            name,
            alpha2code
          },
          state,
          address,
          office_number
        },
        ${pageInfo}
      }
    }
`,
  GET_CURRENCIES: `
    query getCurrencies($cursor: String, $limit: Int){
      currencies(cursor: $cursor, limit: $limit) {
        edges{
          id,name,short
        },
        ${pageInfo}
      }
    }
  `,
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
        ${pageInfo}
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
      ${pageInfo}
    }
  }
`

};