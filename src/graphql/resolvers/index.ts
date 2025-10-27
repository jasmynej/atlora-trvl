import {regionResolvers} from "@/graphql/resolvers/regions";
import {countryResolvers} from "@/graphql/resolvers/countries";

export const resolvers = [
    regionResolvers,
    countryResolvers
];