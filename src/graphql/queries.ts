import { gql } from '@apollo/client';

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUserName($userName: String!) {
    getUserByUserName(input: { userName: $userName }) {
      _id
    }
  }
`;

export const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated {
      status
    }
  }
`;
