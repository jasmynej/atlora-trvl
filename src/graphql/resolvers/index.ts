import {regionResolvers} from "@/graphql/resolvers/regions";
import {countryResolvers} from "@/graphql/resolvers/countries";
import {agencyResolvers} from "@/graphql/resolvers/agencies";
import {userResolvers} from "@/graphql/resolvers/users";
export const resolvers = [
    regionResolvers,
    countryResolvers,
    agencyResolvers,
    userResolvers
];