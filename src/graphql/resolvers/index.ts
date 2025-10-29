import {regionResolvers} from "@/graphql/resolvers/regions";
import {countryResolvers} from "@/graphql/resolvers/countries";
import {agencyResolvers} from "@/graphql/resolvers/agencies";

export const resolvers = [
    regionResolvers,
    countryResolvers,
    agencyResolvers,
];