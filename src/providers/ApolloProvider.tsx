"use client";

import { HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client-integration-nextjs";
import React from "react";

// have a function to create a client for you
function makeClient() {
    const httpLink = new HttpLink({
        // this needs to be an absolute url, as relative urls cannot be used in SSR
        uri: "http://localhost:3000/api/graphql",

    });

    // use the `ApolloClient` from "@apollo/client-integration-nextjs"
    return new ApolloClient({
        // use the `InMemoryCache` from "@apollo/client-integration-nextjs"
        cache: new InMemoryCache(),
        link: httpLink,
    });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}