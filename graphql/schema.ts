import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Date
  type User {
    _id: String!
    userName: String!
  }
  type IsAuthenticated {
    status: Int!
  }
  type SignIn {
    isAuthenticated: Boolean!
  }
  type CreateAccountPayload {
    _id: String!
    token: String!
    userName: String!
  }
  input UserCredens {
    userName: String!
  }
  input getUserByUserName {
    userName: String!
  }
  type SignOutUser {
    status: Int!
  }
  type Query {
    getUserByUserName(input: getUserByUserName): User
    isAuthenticated: IsAuthenticated
  }
  type Mutation {
    signInUser(input: UserCredens): SignIn!
    signOutUser: SignOutUser!
  }
`;

export default typeDefs;
