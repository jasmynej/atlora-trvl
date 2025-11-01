import { gql} from "@apollo/client";

export const travelerTypeDefs = gql`
    type Traveler {
        userId: ID!
        phone: String
        preferences: JSON
        user: User
    }
    
    input TravelerInput {
        userId: ID
        phone: String
        preferences: JSON
    }
    extend type Query {
        traveler(id: ID!): Traveler!
        allTravelers: [Traveler]!
    }
    extend type Mutation {
        createTraveler(data: TravelerInput!): Traveler!
        updateTraveler(id: ID!, data: TravelerInput!): Traveler!
    }
`