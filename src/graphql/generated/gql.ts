/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query allCountries {\n  countries {\n    id\n    slug\n    name\n    flag\n    iso2\n    iso3\n    emoji\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nquery getCountryBySlug($slug: String!) {\n  country: countryBySlug(slug: $slug) {\n    id\n    name\n    iso3\n    iso2\n    flag\n    summary\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nmutation newCountry($data: CountryInput!) {\n  country: createCountry(data: $data) {\n    id\n    slug\n    flag\n  }\n}\n\nmutation updateCountry($id: ID!, $data: CountryInput!) {\n  updateCountry(id: $id, data: $data) {\n    id\n    slug\n    flag\n    summary\n  }\n}\n\nmutation newRegionCountry($data: RegionCountryInput!) {\n  createRegionCountry(data: $data) {\n    countryId\n    regionId\n    isFeatured\n    isPrimary\n  }\n}": typeof types.AllCountriesDocument,
    "query getAllRegions {\n  regions {\n    id\n    heroImg\n    name\n    type\n    slug\n  }\n}\n\nquery getRegionBySlug($slug: String!) {\n  regionBySlug(slug: $slug) {\n    id\n    name\n    type\n    summary\n    heroImg\n    emoji\n    parent {\n      id\n      slug\n      name\n    }\n    children {\n      id\n      slug\n      name\n    }\n    countries {\n      countryId\n      country {\n        name\n      }\n    }\n  }\n}\n\nmutation newRegion($data: RegionInput!) {\n  createRegion(data: $data) {\n    id\n    name\n  }\n}\n\nmutation updateRegion($id: ID!, $data: RegionInput!) {\n  updateRegion(id: $id, data: $data) {\n    id\n    name\n    emoji\n  }\n}": typeof types.GetAllRegionsDocument,
};
const documents: Documents = {
    "query allCountries {\n  countries {\n    id\n    slug\n    name\n    flag\n    iso2\n    iso3\n    emoji\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nquery getCountryBySlug($slug: String!) {\n  country: countryBySlug(slug: $slug) {\n    id\n    name\n    iso3\n    iso2\n    flag\n    summary\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nmutation newCountry($data: CountryInput!) {\n  country: createCountry(data: $data) {\n    id\n    slug\n    flag\n  }\n}\n\nmutation updateCountry($id: ID!, $data: CountryInput!) {\n  updateCountry(id: $id, data: $data) {\n    id\n    slug\n    flag\n    summary\n  }\n}\n\nmutation newRegionCountry($data: RegionCountryInput!) {\n  createRegionCountry(data: $data) {\n    countryId\n    regionId\n    isFeatured\n    isPrimary\n  }\n}": types.AllCountriesDocument,
    "query getAllRegions {\n  regions {\n    id\n    heroImg\n    name\n    type\n    slug\n  }\n}\n\nquery getRegionBySlug($slug: String!) {\n  regionBySlug(slug: $slug) {\n    id\n    name\n    type\n    summary\n    heroImg\n    emoji\n    parent {\n      id\n      slug\n      name\n    }\n    children {\n      id\n      slug\n      name\n    }\n    countries {\n      countryId\n      country {\n        name\n      }\n    }\n  }\n}\n\nmutation newRegion($data: RegionInput!) {\n  createRegion(data: $data) {\n    id\n    name\n  }\n}\n\nmutation updateRegion($id: ID!, $data: RegionInput!) {\n  updateRegion(id: $id, data: $data) {\n    id\n    name\n    emoji\n  }\n}": types.GetAllRegionsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query allCountries {\n  countries {\n    id\n    slug\n    name\n    flag\n    iso2\n    iso3\n    emoji\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nquery getCountryBySlug($slug: String!) {\n  country: countryBySlug(slug: $slug) {\n    id\n    name\n    iso3\n    iso2\n    flag\n    summary\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nmutation newCountry($data: CountryInput!) {\n  country: createCountry(data: $data) {\n    id\n    slug\n    flag\n  }\n}\n\nmutation updateCountry($id: ID!, $data: CountryInput!) {\n  updateCountry(id: $id, data: $data) {\n    id\n    slug\n    flag\n    summary\n  }\n}\n\nmutation newRegionCountry($data: RegionCountryInput!) {\n  createRegionCountry(data: $data) {\n    countryId\n    regionId\n    isFeatured\n    isPrimary\n  }\n}"): (typeof documents)["query allCountries {\n  countries {\n    id\n    slug\n    name\n    flag\n    iso2\n    iso3\n    emoji\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nquery getCountryBySlug($slug: String!) {\n  country: countryBySlug(slug: $slug) {\n    id\n    name\n    iso3\n    iso2\n    flag\n    summary\n    regions {\n      region {\n        name\n      }\n    }\n  }\n}\n\nmutation newCountry($data: CountryInput!) {\n  country: createCountry(data: $data) {\n    id\n    slug\n    flag\n  }\n}\n\nmutation updateCountry($id: ID!, $data: CountryInput!) {\n  updateCountry(id: $id, data: $data) {\n    id\n    slug\n    flag\n    summary\n  }\n}\n\nmutation newRegionCountry($data: RegionCountryInput!) {\n  createRegionCountry(data: $data) {\n    countryId\n    regionId\n    isFeatured\n    isPrimary\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query getAllRegions {\n  regions {\n    id\n    heroImg\n    name\n    type\n    slug\n  }\n}\n\nquery getRegionBySlug($slug: String!) {\n  regionBySlug(slug: $slug) {\n    id\n    name\n    type\n    summary\n    heroImg\n    emoji\n    parent {\n      id\n      slug\n      name\n    }\n    children {\n      id\n      slug\n      name\n    }\n    countries {\n      countryId\n      country {\n        name\n      }\n    }\n  }\n}\n\nmutation newRegion($data: RegionInput!) {\n  createRegion(data: $data) {\n    id\n    name\n  }\n}\n\nmutation updateRegion($id: ID!, $data: RegionInput!) {\n  updateRegion(id: $id, data: $data) {\n    id\n    name\n    emoji\n  }\n}"): (typeof documents)["query getAllRegions {\n  regions {\n    id\n    heroImg\n    name\n    type\n    slug\n  }\n}\n\nquery getRegionBySlug($slug: String!) {\n  regionBySlug(slug: $slug) {\n    id\n    name\n    type\n    summary\n    heroImg\n    emoji\n    parent {\n      id\n      slug\n      name\n    }\n    children {\n      id\n      slug\n      name\n    }\n    countries {\n      countryId\n      country {\n        name\n      }\n    }\n  }\n}\n\nmutation newRegion($data: RegionInput!) {\n  createRegion(data: $data) {\n    id\n    name\n  }\n}\n\nmutation updateRegion($id: ID!, $data: RegionInput!) {\n  updateRegion(id: $id, data: $data) {\n    id\n    name\n    emoji\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;