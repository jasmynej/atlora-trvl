import { gql } from "@apollo/client";

export const regionTypeDefs = gql`
    enum RegionType {
        CONTINENT
        SUBREGION
        MARKET_GROUP
        THEME
    }
    type Region {
        id: ID!
        slug: String!
        name: String!
        type: RegionType!
        summary: String
        heroImg: String
        emoji: String
        parent: Region
        children: [Region!]
        countries: [RegionCountry!]
    }
    
    input RegionInput {
        slug: String
        name: String
        type: RegionType
        summary: String
        heroImg: String
        emoji: String
        parentId: ID
    }
    extend type Query {
        regions: [Region!]!
        regionById(id: ID!): Region
        regionBySlug(slug: String!): Region
    }

    extend type Mutation {
        createRegion(data: RegionInput!): Region!
        updateRegion(id: ID!, data: RegionInput!): Region!
    }
    
`;