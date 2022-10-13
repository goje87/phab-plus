import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Date
  enum DifferentialType {
    AUTHORED
    RESPONSIBLE_FOR
  }
  enum DifferentialStatus {
    DRAFT
    UP_FOR_REVIEW
    CHANGES_REQUESTED
    ACCEPTED
    CLOSED
  }
  type User {
    _id: String!
    userName: String!
  }
  type Differential {
    _id: String!
    diffId: String!
    title: String!
    url: String!
    status: DifferentialStatus!
    diffType: DifferentialType!
    authoredBy: String!
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
  type Success {
    success: Boolean!
  }
  type Query {
    getUserByUserName(input: getUserByUserName): User
    isAuthenticated: IsAuthenticated
    getDifferentials(differentialType: DifferentialType): [Differential]!
  }
  type Mutation {
    signInUser(input: UserCredens): SignIn!
    signOutUser: SignOutUser!
  }
`;

export default typeDefs;
