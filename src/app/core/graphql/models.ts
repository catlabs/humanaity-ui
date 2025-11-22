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
  humans?: Maybe<Array<Human>>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type CityInput = {
  name: Scalars['String']['input'];
};

export type Human = {
  __typename?: 'Human';
  busy: Scalars['Boolean']['output'];
  city?: Maybe<City>;
  creativity: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  intellect: Scalars['Float']['output'];
  name?: Maybe<Scalars['String']['output']>;
  personality: Scalars['String']['output'];
  practicality: Scalars['Float']['output'];
  sociability: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type HumanInput = {
  cityId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCity?: Maybe<City>;
  createHuman?: Maybe<Human>;
  deleteCity?: Maybe<Scalars['Boolean']['output']>;
  deleteHuman?: Maybe<Scalars['Boolean']['output']>;
  isSimulationRunning: Scalars['Boolean']['output'];
  startSimulation: Scalars['String']['output'];
  stopSimulation: Scalars['String']['output'];
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


export type MutationIsSimulationRunningArgs = {
  cityId: Scalars['ID']['input'];
};


export type MutationStartSimulationArgs = {
  cityId: Scalars['ID']['input'];
};


export type MutationStopSimulationArgs = {
  cityId: Scalars['ID']['input'];
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
  citiesByName: Array<Maybe<City>>;
  city: City;
  human: Human;
  humans: Array<Human>;
  humansByCity: Array<Human>;
  humansByJob: Array<Human>;
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

export type Subscription = {
  __typename?: 'Subscription';
  humansByCityPositions: Array<Human>;
};


export type SubscriptionHumansByCityPositionsArgs = {
  cityId: Scalars['ID']['input'];
};

export type GetCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCitiesQuery = { __typename?: 'Query', cities: Array<{ __typename?: 'City', id: string, name?: string | null }> };

export type GetCityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCityQuery = { __typename?: 'Query', city: { __typename?: 'City', id: string, name?: string | null } };

export type PositionSubSubscriptionVariables = Exact<{
  cityId: Scalars['ID']['input'];
}>;


export type PositionSubSubscription = { __typename?: 'Subscription', humansByCityPositions: Array<{ __typename?: 'Human', id: string, name?: string | null, busy: boolean, creativity: number, intellect: number, sociability: number, practicality: number, personality: string, x: number, y: number }> };

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
export const GetCityDocument = gql`
    query GetCity($id: ID!) {
  city(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCityGQL extends Apollo.Query<GetCityQuery, GetCityQueryVariables> {
    document = GetCityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PositionSubDocument = gql`
    subscription PositionSub($cityId: ID!) {
  humansByCityPositions(cityId: $cityId) {
    id
    name
    busy
    creativity
    intellect
    sociability
    practicality
    personality
    x
    y
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PositionSubGQL extends Apollo.Subscription<PositionSubSubscription, PositionSubSubscriptionVariables> {
    document = PositionSubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }