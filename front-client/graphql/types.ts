export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Auth = {
  __typename?: 'Auth';
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type LogoutReponse = {
  __typename?: 'LogoutReponse';
  loggedOut: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  getNewTokens: NewTokenReponse;
  logout: LogoutReponse;
  signin: SignReponse;
  signup: SignReponse;
  updateAuth: Auth;
};


export type MutationLogoutArgs = {
  id: Scalars['String'];
  refreshToken: Scalars['String'];
};


export type MutationSigninArgs = {
  signInInput: SignInInput;
};


export type MutationSignupArgs = {
  signUpInput: SignUpInput;
};


export type MutationUpdateAuthArgs = {
  updateAuthInput: UpdateAuthInput;
};

export type NewTokenReponse = {
  __typename?: 'NewTokenReponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  auth: Auth;
  hello: Scalars['String'];
  users: Array<User>;
};


export type QueryAuthArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  isOnline?: InputMaybe<Scalars['Boolean']>;
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignReponse = {
  __typename?: 'SignReponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: User;
};

export type SignUpInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UpdateAuthInput = {
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type LoginMutationMutationVariables = Exact<{
  input: SignInInput;
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', signin: { __typename?: 'SignReponse', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, username: string, email: string } } };

export type OnlineOfflineUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type OnlineOfflineUsersQuery = { __typename?: 'Query', onlineUsers: Array<{ __typename?: 'User', id: string, username: string }>, offlineUsers: Array<{ __typename?: 'User', id: string, username: string }> };