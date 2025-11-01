/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Country = {
  __typename?: 'Country';
  emoji?: Maybe<Scalars['String']['output']>;
  flag?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  iso3: Scalars['String']['output'];
  name: Scalars['String']['output'];
  regions?: Maybe<Array<RegionCountry>>;
  slug: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
};

export type CountryInput = {
  emoji?: InputMaybe<Scalars['String']['input']>;
  iso2?: InputMaybe<Scalars['String']['input']>;
  iso3?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createCountry: Country;
  createRegion: Region;
  createRegionCountry: RegionCountry;
  updateCountry: Country;
  updateRegion: Region;
};


export type MutationCreateCountryArgs = {
  data: CountryInput;
};


export type MutationCreateRegionArgs = {
  data: RegionInput;
};


export type MutationCreateRegionCountryArgs = {
  data: RegionCountryInput;
};


export type MutationUpdateCountryArgs = {
  data: CountryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRegionArgs = {
  data: RegionInput;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  countries: Array<Country>;
  countryById?: Maybe<Country>;
  countryBySlug?: Maybe<Country>;
  regionById?: Maybe<Region>;
  regionBySlug?: Maybe<Region>;
  regions: Array<Region>;
};


export type QueryCountryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCountryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryRegionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRegionBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type Region = {
  __typename?: 'Region';
  children?: Maybe<Array<Region>>;
  countries?: Maybe<Array<RegionCountry>>;
  emoji?: Maybe<Scalars['String']['output']>;
  heroImg?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Region>;
  slug: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  type: RegionType;
};

export type RegionCountry = {
  __typename?: 'RegionCountry';
  country: Country;
  countryId: Scalars['ID']['output'];
  isFeatured?: Maybe<Scalars['Boolean']['output']>;
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  region: Region;
  regionId: Scalars['ID']['output'];
};

export type RegionCountryInput = {
  countryId: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  regionId: Scalars['ID']['input'];
};

export type RegionInput = {
  emoji?: InputMaybe<Scalars['String']['input']>;
  heroImg?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<RegionType>;
};

export enum RegionType {
  Continent = 'CONTINENT',
  MarketGroup = 'MARKET_GROUP',
  Subregion = 'SUBREGION',
  Theme = 'THEME'
}

export type AllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', id: string, slug: string, name: string, flag?: string | null, iso2: string, iso3: string, emoji?: string | null, regions?: Array<{ __typename?: 'RegionCountry', region: { __typename?: 'Region', name: string } }> | null }> };

export type GetCountryBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCountryBySlugQuery = { __typename?: 'Query', country?: { __typename?: 'Country', id: string, name: string, iso3: string, iso2: string, flag?: string | null, summary?: string | null, regions?: Array<{ __typename?: 'RegionCountry', region: { __typename?: 'Region', name: string } }> | null } | null };

export type NewCountryMutationVariables = Exact<{
  data: CountryInput;
}>;


export type NewCountryMutation = { __typename?: 'Mutation', country: { __typename?: 'Country', id: string, slug: string, flag?: string | null } };

export type UpdateCountryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: CountryInput;
}>;


export type UpdateCountryMutation = { __typename?: 'Mutation', updateCountry: { __typename?: 'Country', id: string, slug: string, flag?: string | null, summary?: string | null } };

export type NewRegionCountryMutationVariables = Exact<{
  data: RegionCountryInput;
}>;


export type NewRegionCountryMutation = { __typename?: 'Mutation', createRegionCountry: { __typename?: 'RegionCountry', countryId: string, regionId: string, isFeatured?: boolean | null, isPrimary?: boolean | null } };

export type GetAllRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRegionsQuery = { __typename?: 'Query', regions: Array<{ __typename?: 'Region', id: string, heroImg?: string | null, name: string, type: RegionType, slug: string, parent?: { __typename?: 'Region', name: string } | null, children?: Array<{ __typename?: 'Region', name: string }> | null }> };

export type GetRegionBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetRegionBySlugQuery = { __typename?: 'Query', regionBySlug?: { __typename?: 'Region', id: string, name: string, type: RegionType, summary?: string | null, heroImg?: string | null, emoji?: string | null, parent?: { __typename?: 'Region', id: string, slug: string, name: string } | null, children?: Array<{ __typename?: 'Region', id: string, slug: string, name: string }> | null, countries?: Array<{ __typename?: 'RegionCountry', countryId: string, country: { __typename?: 'Country', name: string } }> | null } | null };

export type NewRegionMutationVariables = Exact<{
  data: RegionInput;
}>;


export type NewRegionMutation = { __typename?: 'Mutation', createRegion: { __typename?: 'Region', id: string, name: string } };

export type UpdateRegionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: RegionInput;
}>;


export type UpdateRegionMutation = { __typename?: 'Mutation', updateRegion: { __typename?: 'Region', id: string, name: string, emoji?: string | null } };


export const AllCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"region"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCountriesQuery, AllCountriesQueryVariables>;
export const GetCountryBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCountryBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"country"},"name":{"kind":"Name","value":"countryBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"region"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCountryBySlugQuery, GetCountryBySlugQueryVariables>;
export const NewCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"country"},"name":{"kind":"Name","value":"createCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}}]}}]}}]} as unknown as DocumentNode<NewCountryMutation, NewCountryMutationVariables>;
export const UpdateCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]}}]} as unknown as DocumentNode<UpdateCountryMutation, UpdateCountryMutationVariables>;
export const NewRegionCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newRegionCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionCountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRegionCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"regionId"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]} as unknown as DocumentNode<NewRegionCountryMutation, NewRegionCountryMutationVariables>;
export const GetAllRegionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllRegions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"heroImg"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllRegionsQuery, GetAllRegionsQueryVariables>;
export const GetRegionBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRegionBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regionBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"heroImg"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRegionBySlugQuery, GetRegionBySlugQueryVariables>;
export const NewRegionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newRegion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRegion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NewRegionMutation, NewRegionMutationVariables>;
export const UpdateRegionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRegion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRegion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<UpdateRegionMutation, UpdateRegionMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Country = {
  __typename?: 'Country';
  emoji?: Maybe<Scalars['String']['output']>;
  flag?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  iso3: Scalars['String']['output'];
  name: Scalars['String']['output'];
  regions?: Maybe<Array<RegionCountry>>;
  slug: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
};

export type CountryInput = {
  emoji?: InputMaybe<Scalars['String']['input']>;
  iso2?: InputMaybe<Scalars['String']['input']>;
  iso3?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createCountry: Country;
  createRegion: Region;
  createRegionCountry: RegionCountry;
  updateCountry: Country;
  updateRegion: Region;
};


export type MutationCreateCountryArgs = {
  data: CountryInput;
};


export type MutationCreateRegionArgs = {
  data: RegionInput;
};


export type MutationCreateRegionCountryArgs = {
  data: RegionCountryInput;
};


export type MutationUpdateCountryArgs = {
  data: CountryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRegionArgs = {
  data: RegionInput;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  countries: Array<Country>;
  countryById?: Maybe<Country>;
  countryBySlug?: Maybe<Country>;
  regionById?: Maybe<Region>;
  regionBySlug?: Maybe<Region>;
  regions: Array<Region>;
};


export type QueryCountryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCountryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryRegionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRegionBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type Region = {
  __typename?: 'Region';
  children?: Maybe<Array<Region>>;
  countries?: Maybe<Array<RegionCountry>>;
  emoji?: Maybe<Scalars['String']['output']>;
  heroImg?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Region>;
  slug: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  type: RegionType;
};

export type RegionCountry = {
  __typename?: 'RegionCountry';
  country: Country;
  countryId: Scalars['ID']['output'];
  isFeatured?: Maybe<Scalars['Boolean']['output']>;
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  region: Region;
  regionId: Scalars['ID']['output'];
};

export type RegionCountryInput = {
  countryId: Scalars['ID']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  regionId: Scalars['ID']['input'];
};

export type RegionInput = {
  emoji?: InputMaybe<Scalars['String']['input']>;
  heroImg?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<RegionType>;
};

export enum RegionType {
  Continent = 'CONTINENT',
  MarketGroup = 'MARKET_GROUP',
  Subregion = 'SUBREGION',
  Theme = 'THEME'
}

export type AllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', id: string, slug: string, name: string, flag?: string | null, iso2: string, iso3: string, emoji?: string | null, regions?: Array<{ __typename?: 'RegionCountry', region: { __typename?: 'Region', name: string } }> | null }> };

export type GetCountryBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCountryBySlugQuery = { __typename?: 'Query', country?: { __typename?: 'Country', id: string, name: string, iso3: string, iso2: string, flag?: string | null, summary?: string | null, regions?: Array<{ __typename?: 'RegionCountry', region: { __typename?: 'Region', name: string } }> | null } | null };

export type NewCountryMutationVariables = Exact<{
  data: CountryInput;
}>;


export type NewCountryMutation = { __typename?: 'Mutation', country: { __typename?: 'Country', id: string, slug: string, flag?: string | null } };

export type UpdateCountryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: CountryInput;
}>;


export type UpdateCountryMutation = { __typename?: 'Mutation', updateCountry: { __typename?: 'Country', id: string, slug: string, flag?: string | null, summary?: string | null } };

export type NewRegionCountryMutationVariables = Exact<{
  data: RegionCountryInput;
}>;


export type NewRegionCountryMutation = { __typename?: 'Mutation', createRegionCountry: { __typename?: 'RegionCountry', countryId: string, regionId: string, isFeatured?: boolean | null, isPrimary?: boolean | null } };

export type GetAllRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRegionsQuery = { __typename?: 'Query', regions: Array<{ __typename?: 'Region', id: string, heroImg?: string | null, name: string, type: RegionType, slug: string, parent?: { __typename?: 'Region', name: string } | null, children?: Array<{ __typename?: 'Region', name: string }> | null }> };

export type GetRegionBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetRegionBySlugQuery = { __typename?: 'Query', regionBySlug?: { __typename?: 'Region', id: string, name: string, type: RegionType, summary?: string | null, heroImg?: string | null, emoji?: string | null, parent?: { __typename?: 'Region', id: string, slug: string, name: string } | null, children?: Array<{ __typename?: 'Region', id: string, slug: string, name: string }> | null, countries?: Array<{ __typename?: 'RegionCountry', countryId: string, country: { __typename?: 'Country', name: string } }> | null } | null };

export type NewRegionMutationVariables = Exact<{
  data: RegionInput;
}>;


export type NewRegionMutation = { __typename?: 'Mutation', createRegion: { __typename?: 'Region', id: string, name: string } };

export type UpdateRegionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: RegionInput;
}>;


export type UpdateRegionMutation = { __typename?: 'Mutation', updateRegion: { __typename?: 'Region', id: string, name: string, emoji?: string | null } };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Country: ResolverTypeWrapper<Country>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  CountryInput: CountryInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Region: ResolverTypeWrapper<Region>;
  RegionCountry: ResolverTypeWrapper<RegionCountry>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  RegionCountryInput: RegionCountryInput;
  RegionInput: RegionInput;
  RegionType: RegionType;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Country: Country;
  String: Scalars['String']['output'];
  ID: Scalars['ID']['output'];
  CountryInput: CountryInput;
  DateTime: Scalars['DateTime']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  Region: Region;
  RegionCountry: RegionCountry;
  Boolean: Scalars['Boolean']['output'];
  RegionCountryInput: RegionCountryInput;
  RegionInput: RegionInput;
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  emoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  iso2?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iso3?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  regions?: Resolver<Maybe<Array<ResolversTypes['RegionCountry']>>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationCreateCountryArgs, 'data'>>;
  createRegion?: Resolver<ResolversTypes['Region'], ParentType, ContextType, RequireFields<MutationCreateRegionArgs, 'data'>>;
  createRegionCountry?: Resolver<ResolversTypes['RegionCountry'], ParentType, ContextType, RequireFields<MutationCreateRegionCountryArgs, 'data'>>;
  updateCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationUpdateCountryArgs, 'data' | 'id'>>;
  updateRegion?: Resolver<ResolversTypes['Region'], ParentType, ContextType, RequireFields<MutationUpdateRegionArgs, 'data' | 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countries?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>;
  countryById?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryByIdArgs, 'id'>>;
  countryBySlug?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryBySlugArgs, 'slug'>>;
  regionById?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType, RequireFields<QueryRegionByIdArgs, 'id'>>;
  regionBySlug?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType, RequireFields<QueryRegionBySlugArgs, 'slug'>>;
  regions?: Resolver<Array<ResolversTypes['Region']>, ParentType, ContextType>;
};

export type RegionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Region']>>, ParentType, ContextType>;
  countries?: Resolver<Maybe<Array<ResolversTypes['RegionCountry']>>, ParentType, ContextType>;
  emoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  heroImg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RegionType'], ParentType, ContextType>;
};

export type RegionCountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegionCountry'] = ResolversParentTypes['RegionCountry']> = {
  country?: Resolver<ResolversTypes['Country'], ParentType, ContextType>;
  countryId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFeatured?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPrimary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  region?: Resolver<ResolversTypes['Region'], ParentType, ContextType>;
  regionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Country?: CountryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  RegionCountry?: RegionCountryResolvers<ContextType>;
};

