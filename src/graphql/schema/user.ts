import { gql } from "@apollo/client";
export const userTypeDefs = gql`
    enum GlobalRole {
        ATLORA_ADMIN
        USER
    }
    type User {
        id: ID!
        email: String!
        name: String
        image: String
        globalRole: GlobalRole!
        agencyProfiles: [AgencyMember]
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    input UserInput {
        email: String
        name: String
        image: String
        globalRole: GlobalRole
    }
    
    extend type Query {
        user(id: ID!): User!
        users: [User]!
        usersByRole(role: GlobalRole!): [User]!
    }
    extend type Mutation {
        createUser(data: UserInput!): User!
        updateUser(id: ID!, data: UserInput!): User!
    }
`