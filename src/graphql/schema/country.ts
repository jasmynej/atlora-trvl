import { gql } from "@apollo/client";

export const countryTypeDefs = gql`
    type Country {
        id: ID!
        slug: String!
        name: String!
        iso2: String!
        iso3: String!
        flag: String
        emoji: String
        summary: String
        regions: [RegionCountry!]
    }
    
    type RegionCountry {
        regionId: ID!
        countryId: ID!
        isFeatured: Boolean
        isPrimary: Boolean
        country: Country!
        region: Region!
    }
    
    input CountryInput {
        slug: String
        name: String
        iso2: String
        iso3: String
        emoji: String
        summary: String
    }
    
    input RegionCountryInput {
        regionId: ID!
        countryId: ID!
        isFeatured: Boolean
        isPrimary: Boolean
    }
    
    extend type Query {
        countries: [Country!]!
        countryById(id: ID!): Country
        countryBySlug(slug: String!): Country
    }
    
    extend type Mutation {
        createCountry(data: CountryInput!): Country!
        updateCountry(id: ID!, data: CountryInput!): Country!
        createRegionCountry(data: RegionCountryInput!): RegionCountry!
    }
    
`;