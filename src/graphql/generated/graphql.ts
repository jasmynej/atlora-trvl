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

export type Agency = {
  __typename?: 'Agency';
  contact: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<Maybe<AgencyMember>>>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  theme?: Maybe<Scalars['JSON']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AgencyInput = {
  contact?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  theme?: InputMaybe<Scalars['JSON']['input']>;
};

export type AgencyMember = {
  __typename?: 'AgencyMember';
  agency: Agency;
  agencyId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: AgencyRole;
  user: User;
  userId: Scalars['ID']['output'];
};

export type AgencyMemberInput = {
  agencyId: Scalars['ID']['input'];
  role: AgencyRole;
  userId: Scalars['ID']['input'];
};

export enum AgencyRole {
  AgencyAdmin = 'AGENCY_ADMIN',
  TeamMember = 'TEAM_MEMBER'
}

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

export enum GlobalRole {
  AtloraAdmin = 'ATLORA_ADMIN',
  User = 'USER'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  addAgency: Agency;
  addAgencyMember: AgencyMember;
  createCountry: Country;
  createRegion: Region;
  createRegionCountry: RegionCountry;
  createTraveler: Traveler;
  createUser: User;
  updateAgency: Agency;
  updateCountry: Country;
  updateRegion: Region;
  updateTraveler: Traveler;
  updateUser: User;
};


export type MutationAddAgencyArgs = {
  data: AgencyInput;
};


export type MutationAddAgencyMemberArgs = {
  data: AgencyMemberInput;
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


export type MutationCreateTravelerArgs = {
  data: TravelerInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationUpdateAgencyArgs = {
  data: AgencyInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCountryArgs = {
  data: CountryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRegionArgs = {
  data: RegionInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTravelerArgs = {
  data: TravelerInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserInput;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  agencies: Array<Maybe<Agency>>;
  agency: Agency;
  agencyById: Agency;
  allTravelers: Array<Maybe<Traveler>>;
  countries: Array<Country>;
  countryById?: Maybe<Country>;
  countryBySlug?: Maybe<Country>;
  regionById?: Maybe<Region>;
  regionBySlug?: Maybe<Region>;
  regions: Array<Region>;
  traveler: Traveler;
  user: User;
  users: Array<Maybe<User>>;
  usersByRole: Array<Maybe<User>>;
};


export type QueryAgencyArgs = {
  slug: Scalars['String']['input'];
};


export type QueryAgencyByIdArgs = {
  id: Scalars['ID']['input'];
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


export type QueryTravelerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersByRoleArgs = {
  role: GlobalRole;
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

export type Traveler = {
  __typename?: 'Traveler';
  phone?: Maybe<Scalars['String']['output']>;
  preferences?: Maybe<Scalars['JSON']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type TravelerInput = {
  phone?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['JSON']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  agencyProfiles?: Maybe<Array<Maybe<AgencyMember>>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  globalRole: GlobalRole;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  globalRole?: InputMaybe<GlobalRole>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GetAllAgenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAgenciesQuery = { __typename?: 'Query', agencies: Array<{ __typename?: 'Agency', id: string, name: string, slug: string, logo?: string | null, theme?: any | null } | null> };

export type GetAgencyBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetAgencyBySlugQuery = { __typename?: 'Query', agency: { __typename?: 'Agency', id: string, name: string, slug: string, theme?: any | null, logo?: string | null, members?: Array<{ __typename?: 'AgencyMember', role: AgencyRole, user: { __typename?: 'User', id: string, name?: string | null, image?: string | null } } | null> | null } };

export type AddAgencyMutationVariables = Exact<{
  data: AgencyInput;
}>;


export type AddAgencyMutation = { __typename?: 'Mutation', agency: { __typename?: 'Agency', id: string, name: string, slug: string } };

export type UpdateAgencyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: AgencyInput;
}>;


export type UpdateAgencyMutation = { __typename?: 'Mutation', agency: { __typename?: 'Agency', id: string, name: string, slug: string, theme?: any | null } };

export type AddAgencyMemberMutationVariables = Exact<{
  data: AgencyMemberInput;
}>;


export type AddAgencyMemberMutation = { __typename?: 'Mutation', addAgencyMember: { __typename?: 'AgencyMember', agency: { __typename?: 'Agency', id: string, name: string } } };

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

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null, agencyProfiles?: Array<{ __typename?: 'AgencyMember', role: AgencyRole, agency: { __typename?: 'Agency', id: string, name: string, logo?: string | null, slug: string } } | null> | null } };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name?: string | null, email: string, globalRole: GlobalRole, agencyProfiles?: Array<{ __typename?: 'AgencyMember', agency: { __typename?: 'Agency', id: string, name: string } } | null> | null } | null> };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } };


export const GetAllAgenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAgencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}}]}}]}}]} as unknown as DocumentNode<GetAllAgenciesQuery, GetAllAgenciesQueryVariables>;
export const GetAgencyBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgencyBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAgencyBySlugQuery, GetAgencyBySlugQueryVariables>;
export const AddAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgencyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"agency"},"name":{"kind":"Name","value":"addAgency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<AddAgencyMutation, AddAgencyMutationVariables>;
export const UpdateAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAgency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgencyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"agency"},"name":{"kind":"Name","value":"updateAgency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}}]}}]}}]} as unknown as DocumentNode<UpdateAgencyMutation, UpdateAgencyMutationVariables>;
export const AddAgencyMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addAgencyMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AgencyMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAgencyMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AddAgencyMemberMutation, AddAgencyMemberMutationVariables>;
export const AllCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"region"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCountriesQuery, AllCountriesQueryVariables>;
export const GetCountryBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCountryBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"country"},"name":{"kind":"Name","value":"countryBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"region"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCountryBySlugQuery, GetCountryBySlugQueryVariables>;
export const NewCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"country"},"name":{"kind":"Name","value":"createCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}}]}}]}}]} as unknown as DocumentNode<NewCountryMutation, NewCountryMutationVariables>;
export const UpdateCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]}}]} as unknown as DocumentNode<UpdateCountryMutation, UpdateCountryMutationVariables>;
export const NewRegionCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newRegionCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionCountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRegionCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"regionId"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]} as unknown as DocumentNode<NewRegionCountryMutation, NewRegionCountryMutationVariables>;
export const GetAllRegionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllRegions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"heroImg"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllRegionsQuery, GetAllRegionsQueryVariables>;
export const GetRegionBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRegionBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regionBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"heroImg"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRegionBySlugQuery, GetRegionBySlugQueryVariables>;
export const NewRegionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"newRegion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRegion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NewRegionMutation, NewRegionMutationVariables>;
export const UpdateRegionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRegion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRegion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<UpdateRegionMutation, UpdateRegionMutationVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"agencyProfiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const AllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"agencyProfiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllUsersQuery, AllUsersQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
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

export type Agency = {
  __typename?: 'Agency';
  contact: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<Maybe<AgencyMember>>>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  theme?: Maybe<Scalars['JSON']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AgencyInput = {
  contact?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  theme?: InputMaybe<Scalars['JSON']['input']>;
};

export type AgencyMember = {
  __typename?: 'AgencyMember';
  agency: Agency;
  agencyId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: AgencyRole;
  user: User;
  userId: Scalars['ID']['output'];
};

export type AgencyMemberInput = {
  agencyId: Scalars['ID']['input'];
  role: AgencyRole;
  userId: Scalars['ID']['input'];
};

export enum AgencyRole {
  AgencyAdmin = 'AGENCY_ADMIN',
  TeamMember = 'TEAM_MEMBER'
}

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

export enum GlobalRole {
  AtloraAdmin = 'ATLORA_ADMIN',
  User = 'USER'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  addAgency: Agency;
  addAgencyMember: AgencyMember;
  createCountry: Country;
  createRegion: Region;
  createRegionCountry: RegionCountry;
  createTraveler: Traveler;
  createUser: User;
  updateAgency: Agency;
  updateCountry: Country;
  updateRegion: Region;
  updateTraveler: Traveler;
  updateUser: User;
};


export type MutationAddAgencyArgs = {
  data: AgencyInput;
};


export type MutationAddAgencyMemberArgs = {
  data: AgencyMemberInput;
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


export type MutationCreateTravelerArgs = {
  data: TravelerInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationUpdateAgencyArgs = {
  data: AgencyInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCountryArgs = {
  data: CountryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRegionArgs = {
  data: RegionInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTravelerArgs = {
  data: TravelerInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserInput;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  agencies: Array<Maybe<Agency>>;
  agency: Agency;
  agencyById: Agency;
  allTravelers: Array<Maybe<Traveler>>;
  countries: Array<Country>;
  countryById?: Maybe<Country>;
  countryBySlug?: Maybe<Country>;
  regionById?: Maybe<Region>;
  regionBySlug?: Maybe<Region>;
  regions: Array<Region>;
  traveler: Traveler;
  user: User;
  users: Array<Maybe<User>>;
  usersByRole: Array<Maybe<User>>;
};


export type QueryAgencyArgs = {
  slug: Scalars['String']['input'];
};


export type QueryAgencyByIdArgs = {
  id: Scalars['ID']['input'];
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


export type QueryTravelerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersByRoleArgs = {
  role: GlobalRole;
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

export type Traveler = {
  __typename?: 'Traveler';
  phone?: Maybe<Scalars['String']['output']>;
  preferences?: Maybe<Scalars['JSON']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type TravelerInput = {
  phone?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['JSON']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  agencyProfiles?: Maybe<Array<Maybe<AgencyMember>>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  globalRole: GlobalRole;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  globalRole?: InputMaybe<GlobalRole>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GetAllAgenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAgenciesQuery = { __typename?: 'Query', agencies: Array<{ __typename?: 'Agency', id: string, name: string, slug: string, logo?: string | null, theme?: any | null } | null> };

export type GetAgencyBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetAgencyBySlugQuery = { __typename?: 'Query', agency: { __typename?: 'Agency', id: string, name: string, slug: string, theme?: any | null, logo?: string | null, members?: Array<{ __typename?: 'AgencyMember', role: AgencyRole, user: { __typename?: 'User', id: string, name?: string | null, image?: string | null } } | null> | null } };

export type AddAgencyMutationVariables = Exact<{
  data: AgencyInput;
}>;


export type AddAgencyMutation = { __typename?: 'Mutation', agency: { __typename?: 'Agency', id: string, name: string, slug: string } };

export type UpdateAgencyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: AgencyInput;
}>;


export type UpdateAgencyMutation = { __typename?: 'Mutation', agency: { __typename?: 'Agency', id: string, name: string, slug: string, theme?: any | null } };

export type AddAgencyMemberMutationVariables = Exact<{
  data: AgencyMemberInput;
}>;


export type AddAgencyMemberMutation = { __typename?: 'Mutation', addAgencyMember: { __typename?: 'AgencyMember', agency: { __typename?: 'Agency', id: string, name: string } } };

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

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null, agencyProfiles?: Array<{ __typename?: 'AgencyMember', role: AgencyRole, agency: { __typename?: 'Agency', id: string, name: string, logo?: string | null, slug: string } } | null> | null } };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name?: string | null, email: string, globalRole: GlobalRole, agencyProfiles?: Array<{ __typename?: 'AgencyMember', agency: { __typename?: 'Agency', id: string, name: string } } | null> | null } | null> };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } };



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
  Agency: ResolverTypeWrapper<Agency>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  AgencyInput: AgencyInput;
  AgencyMember: ResolverTypeWrapper<AgencyMember>;
  AgencyMemberInput: AgencyMemberInput;
  AgencyRole: AgencyRole;
  Country: ResolverTypeWrapper<Country>;
  CountryInput: CountryInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  GlobalRole: GlobalRole;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Region: ResolverTypeWrapper<Region>;
  RegionCountry: ResolverTypeWrapper<RegionCountry>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  RegionCountryInput: RegionCountryInput;
  RegionInput: RegionInput;
  RegionType: RegionType;
  Traveler: ResolverTypeWrapper<Traveler>;
  TravelerInput: TravelerInput;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Agency: Agency;
  String: Scalars['String']['output'];
  ID: Scalars['ID']['output'];
  AgencyInput: AgencyInput;
  AgencyMember: AgencyMember;
  AgencyMemberInput: AgencyMemberInput;
  Country: Country;
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
  Traveler: Traveler;
  TravelerInput: TravelerInput;
  User: User;
  UserInput: UserInput;
};

export type AgencyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Agency'] = ResolversParentTypes['Agency']> = {
  contact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['AgencyMember']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  theme?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type AgencyMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['AgencyMember'] = ResolversParentTypes['AgencyMember']> = {
  agency?: Resolver<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['AgencyRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  addAgency?: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationAddAgencyArgs, 'data'>>;
  addAgencyMember?: Resolver<ResolversTypes['AgencyMember'], ParentType, ContextType, RequireFields<MutationAddAgencyMemberArgs, 'data'>>;
  createCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationCreateCountryArgs, 'data'>>;
  createRegion?: Resolver<ResolversTypes['Region'], ParentType, ContextType, RequireFields<MutationCreateRegionArgs, 'data'>>;
  createRegionCountry?: Resolver<ResolversTypes['RegionCountry'], ParentType, ContextType, RequireFields<MutationCreateRegionCountryArgs, 'data'>>;
  createTraveler?: Resolver<ResolversTypes['Traveler'], ParentType, ContextType, RequireFields<MutationCreateTravelerArgs, 'data'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  updateAgency?: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationUpdateAgencyArgs, 'data' | 'id'>>;
  updateCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationUpdateCountryArgs, 'data' | 'id'>>;
  updateRegion?: Resolver<ResolversTypes['Region'], ParentType, ContextType, RequireFields<MutationUpdateRegionArgs, 'data' | 'id'>>;
  updateTraveler?: Resolver<ResolversTypes['Traveler'], ParentType, ContextType, RequireFields<MutationUpdateTravelerArgs, 'data' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  agencies?: Resolver<Array<Maybe<ResolversTypes['Agency']>>, ParentType, ContextType>;
  agency?: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<QueryAgencyArgs, 'slug'>>;
  agencyById?: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<QueryAgencyByIdArgs, 'id'>>;
  allTravelers?: Resolver<Array<Maybe<ResolversTypes['Traveler']>>, ParentType, ContextType>;
  countries?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>;
  countryById?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryByIdArgs, 'id'>>;
  countryBySlug?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryBySlugArgs, 'slug'>>;
  regionById?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType, RequireFields<QueryRegionByIdArgs, 'id'>>;
  regionBySlug?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType, RequireFields<QueryRegionBySlugArgs, 'slug'>>;
  regions?: Resolver<Array<ResolversTypes['Region']>, ParentType, ContextType>;
  traveler?: Resolver<ResolversTypes['Traveler'], ParentType, ContextType, RequireFields<QueryTravelerArgs, 'id'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  usersByRole?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryUsersByRoleArgs, 'role'>>;
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

export type TravelerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Traveler'] = ResolversParentTypes['Traveler']> = {
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preferences?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  agencyProfiles?: Resolver<Maybe<Array<Maybe<ResolversTypes['AgencyMember']>>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  globalRole?: Resolver<ResolversTypes['GlobalRole'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Agency?: AgencyResolvers<ContextType>;
  AgencyMember?: AgencyMemberResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  RegionCountry?: RegionCountryResolvers<ContextType>;
  Traveler?: TravelerResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

