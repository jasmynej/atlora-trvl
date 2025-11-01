import { gql } from "@apollo/client";
import {regionTypeDefs} from "./region";
import {countryTypeDefs} from "./country";
import {userTypeDefs} from "./user";
import {agencyTypeDefs} from "./agency";
import {travelerTypeDefs} from "@/graphql/schema/traveler";

export const typeDefs =[
    gql`
        scalar JSON
        scalar DateTime
        type Query {
            _empty: String
        }

        type Mutation {
            _empty: String
        }
    `,
    regionTypeDefs,
    countryTypeDefs,
    userTypeDefs,
    agencyTypeDefs,
    travelerTypeDefs,
    ]
;