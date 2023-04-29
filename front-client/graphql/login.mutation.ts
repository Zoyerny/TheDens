import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: SignInInput!) {
    signin(signInInput: $input) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;
