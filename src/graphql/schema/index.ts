import { gql } from "@apollo/client";
import {regionTypeDefs} from "./region";
import {countryTypeDefs} from "./country";

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
    ]
;