import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Album = {
  __typename?: 'Album';
  artist: Artist;
  genre: MusicGenre;
  id: Scalars['String']['output'];
  recordCompany: RecordCompany;
  releaseDate: Scalars['Date']['output'];
  songs: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Artist = {
  __typename?: 'Artist';
  albums?: Maybe<Array<Album>>;
  dateFormed: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  members: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  numOfAlbums?: Maybe<Scalars['Int']['output']>;
};

export enum MusicGenre {
  Alternative = 'ALTERNATIVE',
  Classical = 'CLASSICAL',
  Country = 'COUNTRY',
  Electronic = 'ELECTRONIC',
  HipHop = 'HIP_HOP',
  Indie = 'INDIE',
  Jazz = 'JAZZ',
  Pop = 'POP',
  Rock = 'ROCK',
  RAndB = 'R_AND_B'
}

export type Query = {
  __typename?: 'Query';
  albums?: Maybe<Array<Maybe<Album>>>;
  albumsByGenre?: Maybe<Array<Maybe<Album>>>;
  artists?: Maybe<Array<Maybe<Artist>>>;
  companyByFoundedYear?: Maybe<Array<Maybe<RecordCompany>>>;
  getAlbumById?: Maybe<Album>;
  getArtistById?: Maybe<Artist>;
  getCompanyById?: Maybe<RecordCompany>;
  getSongsByArtistId?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  recordCompanies?: Maybe<Array<Maybe<RecordCompany>>>;
  searchArtistByArtistName?: Maybe<Array<Maybe<Artist>>>;
};


export type QueryAlbumsByGenreArgs = {
  genre: MusicGenre;
};


export type QueryCompanyByFoundedYearArgs = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};


export type QueryGetAlbumByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryGetArtistByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryGetCompanyByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryGetSongsByArtistIdArgs = {
  artistId: Scalars['String']['input'];
};


export type QuerySearchArtistByArtistNameArgs = {
  searchTerm: Scalars['String']['input'];
};

export type RecordCompany = {
  __typename?: 'RecordCompany';
  albums?: Maybe<Array<Album>>;
  country?: Maybe<Scalars['String']['output']>;
  foundedYear: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  numOfAlbums?: Maybe<Scalars['Int']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Album: ResolverTypeWrapper<Album>;
  Artist: ResolverTypeWrapper<Artist>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MusicGenre: MusicGenre;
  Query: ResolverTypeWrapper<{}>;
  RecordCompany: ResolverTypeWrapper<RecordCompany>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Album: Album;
  Artist: Artist;
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Int: Scalars['Int']['output'];
  Query: {};
  RecordCompany: RecordCompany;
  String: Scalars['String']['output'];
};

export type AlbumResolvers<ContextType = any, ParentType extends ResolversParentTypes['Album'] = ResolversParentTypes['Album']> = {
  artist?: Resolver<ResolversTypes['Artist'], ParentType, ContextType>;
  genre?: Resolver<ResolversTypes['MusicGenre'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recordCompany?: Resolver<ResolversTypes['RecordCompany'], ParentType, ContextType>;
  releaseDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  songs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArtistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Artist'] = ResolversParentTypes['Artist']> = {
  albums?: Resolver<Maybe<Array<ResolversTypes['Album']>>, ParentType, ContextType>;
  dateFormed?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numOfAlbums?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  albums?: Resolver<Maybe<Array<Maybe<ResolversTypes['Album']>>>, ParentType, ContextType>;
  albumsByGenre?: Resolver<Maybe<Array<Maybe<ResolversTypes['Album']>>>, ParentType, ContextType, RequireFields<QueryAlbumsByGenreArgs, 'genre'>>;
  artists?: Resolver<Maybe<Array<Maybe<ResolversTypes['Artist']>>>, ParentType, ContextType>;
  companyByFoundedYear?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecordCompany']>>>, ParentType, ContextType, RequireFields<QueryCompanyByFoundedYearArgs, 'max' | 'min'>>;
  getAlbumById?: Resolver<Maybe<ResolversTypes['Album']>, ParentType, ContextType, RequireFields<QueryGetAlbumByIdArgs, '_id'>>;
  getArtistById?: Resolver<Maybe<ResolversTypes['Artist']>, ParentType, ContextType, RequireFields<QueryGetArtistByIdArgs, '_id'>>;
  getCompanyById?: Resolver<Maybe<ResolversTypes['RecordCompany']>, ParentType, ContextType, RequireFields<QueryGetCompanyByIdArgs, '_id'>>;
  getSongsByArtistId?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType, RequireFields<QueryGetSongsByArtistIdArgs, 'artistId'>>;
  recordCompanies?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecordCompany']>>>, ParentType, ContextType>;
  searchArtistByArtistName?: Resolver<Maybe<Array<Maybe<ResolversTypes['Artist']>>>, ParentType, ContextType, RequireFields<QuerySearchArtistByArtistNameArgs, 'searchTerm'>>;
};

export type RecordCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecordCompany'] = ResolversParentTypes['RecordCompany']> = {
  albums?: Resolver<Maybe<Array<ResolversTypes['Album']>>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  foundedYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numOfAlbums?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Album?: AlbumResolvers<ContextType>;
  Artist?: ArtistResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RecordCompany?: RecordCompanyResolvers<ContextType>;
};

