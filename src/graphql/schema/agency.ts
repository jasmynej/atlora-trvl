import { gql } from "@apollo/client";

export const agencyTypeDefs = gql`
    enum AgencyRole {
        AGENCY_ADMIN
        TEAM_MEMBER
    }
    
    type Agency {
        id: ID!
        name: String!
        slug: String!
        contact: String!
        logo: String
        theme: JSON
        createdAt: DateTime!
        updatedAt: DateTime!
        members: [AgencyMember]
    }
    
    type AgencyMember {
        id: ID!
        agencyId: ID!
        userId: ID!
        role: AgencyRole!
        createdAt: DateTime!
        agency: Agency!
        user: User!
    }
    
    input AgencyInput {
        name: String!
        slug: String!
        contact: String
        logo: String
        theme: JSON
    }
    
    input AgencyMemberInput {
        agencyId: ID!
        userId: ID!
        role: AgencyRole!
    }
    
    extend type Query {
        agency(slug: String!): Agency!
        agencyById(id: ID!): Agency!
        agencies: [Agency]!
    }
    
    extend type Mutation {
        addAgency(data: AgencyInput!): Agency!
        updateAgency(id: ID!, data: AgencyInput!): Agency!
        addAgencyMember(data: AgencyMemberInput!): AgencyMember!
    }

`