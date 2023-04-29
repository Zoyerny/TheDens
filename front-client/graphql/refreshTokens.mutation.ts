import gql from "graphql-tag";

export const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokensMutation($refreshToken: String!) {
    getNewTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
