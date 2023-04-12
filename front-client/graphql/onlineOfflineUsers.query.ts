import gql from "graphql-tag";

export const ONLINE_OFFLINE_USERS_QUERY = gql`
  query OnlineOfflineUsers {
    onlineUsers: users(isOnline: true) {
      id
      username
    }
    offlineUsers: users(isOnline: false) {
      id
      username
    }
  }
`;


