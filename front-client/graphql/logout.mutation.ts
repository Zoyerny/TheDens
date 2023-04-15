import gql from "graphql-tag";

export const LOGOUT_MUTATION = gql`
mutation Logout($id: String!) {
  logout(id: $id) {
    loggedOut
  }
}

`;
