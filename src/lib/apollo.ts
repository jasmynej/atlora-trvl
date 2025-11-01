import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({uri: "/api/graphql"}), // your API route
    cache: new InMemoryCache(),
});

export default client;