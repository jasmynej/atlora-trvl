"use client";

import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
    AddAgencyMemberDocument,
    GetAgencyBySlugDocument,
    type AddAgencyMemberMutation,
    type GetAgencyBySlugQuery,
} from "@/graphql/generated/graphql";

/**
 * Client-safe wrapper for agency connection operations.
 * Keeps Node internals out of the client bundle.
 */
export function useConnectAgency() {
    const [getAgencyBySlug, getAgencyState] =
        useLazyQuery<GetAgencyBySlugQuery>(GetAgencyBySlugDocument);

    const [addAgencyMember, addAgencyState] =
        useMutation<AddAgencyMemberMutation>(AddAgencyMemberDocument);

    return {
        /** Lazy query to fetch an agency by slug */
        getAgencyBySlug,
        getAgencyState,

        /** Mutation to add a user to an agency */
        addAgencyMember,
        addAgencyState,
    };
}