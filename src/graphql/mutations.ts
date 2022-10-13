import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(input: { email: $email, password: $password }) {
      token
    }
  }
`;

export const SIGN_IN_USER = gql`
  mutation SignInUser($userName: String!) {
    signInUser(input: { userName: $userName }) {
      isAuthenticated
    }
  }
`;

export const SIGN_OUT_USER = gql`
  mutation SignOutUser {
    signOutUser {
      status
    }
  }
`;

export const CHANGE_DIFF_STATUS = gql`
  mutation ChangeDiffStatus($input: ChangeDiffStatusInput) {
    changeDiffStatus(input: $input) {
      success
    }
  }
`;
