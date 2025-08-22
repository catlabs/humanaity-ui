import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type City = {
  __typename?: 'City';
  humans?: Maybe<Array<Maybe<Human>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CityInput = {
  name: Scalars['String']['input'];
};

export type Human = {
  __typename?: 'Human';
  age: Scalars['Int']['output'];
  city: City;
  happiness: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  job?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type HumanInput = {
  age: Scalars['Int']['input'];
  cityId: Scalars['ID']['input'];
  happiness: Scalars['Float']['input'];
  job?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCity?: Maybe<City>;
  createHuman?: Maybe<Human>;
  deleteCity?: Maybe<Scalars['Boolean']['output']>;
  deleteHuman?: Maybe<Scalars['Boolean']['output']>;
  updateCity?: Maybe<City>;
  updateHuman?: Maybe<Human>;
};


export type MutationCreateCityArgs = {
  input: CityInput;
};


export type MutationCreateHumanArgs = {
  input: HumanInput;
};


export type MutationDeleteCityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHumanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCityArgs = {
  id: Scalars['ID']['input'];
  input: CityInput;
};


export type MutationUpdateHumanArgs = {
  id: Scalars['ID']['input'];
  input: HumanInput;
};

export type Query = {
  __typename?: 'Query';
  cities: Array<City>;
  citiesByName?: Maybe<Array<Maybe<City>>>;
  city?: Maybe<City>;
  human?: Maybe<Human>;
  humans?: Maybe<Array<Maybe<Human>>>;
  humansByCity?: Maybe<Array<Maybe<Human>>>;
  humansByJob?: Maybe<Array<Maybe<Human>>>;
};


export type QueryCitiesByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryCityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHumanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHumansByCityArgs = {
  cityId: Scalars['ID']['input'];
};


export type QueryHumansByJobArgs = {
  job: Scalars['String']['input'];
};

export type GetCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCitiesQuery = { __typename?: 'Query', cities: Array<{ __typename?: 'City', id: string, name: string }> };

export const GetCitiesDocument = gql`
    query GetCities {
  cities {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCitiesGQL extends Apollo.Query<GetCitiesQuery, GetCitiesQueryVariables> {
    document = GetCitiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }