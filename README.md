# CS-554 Lab 3: Creating a GraphQL Server with Apollo, Redis, and MongoDB

## Overview
In this project for CS-554, we're tasked with building a GraphQL server leveraging Apollo Server, Redis for caching, and MongoDB as our data storage. Our application focuses on managing and querying data related to artists, albums, and record companies.

## Database Schema
Our MongoDB setup involves three primary collections: `artists`, `albums`, and `recordcompanies`, structured as follows:

### Artists Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "dateFormed": "date",
  "members": ["array_of_strings"],
  "albums": ["array_of_albums_ids"]
}
```

### Albums Collection
```json
{
  "_id": "ObjectId",
  "title": "String",
  "releaseDate": "date",
  "genre": "string",
  "artistId": "ObjectId",
  "recordCompanyId": "ObjectId",
  "songs": ["array_of_strings"]
}
```

### Record Companies Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "foundedYear": "number",
  "country": "string",
  "albums": ["array_of_ObjectIds"]
}
```

## Schema Definitions
We define three main GraphQL types (`Artist`, `Album`, and `RecordCompany`) along with queries and mutations to interact with our data.

### Types 
```graphql
type Artist {
  id: String!
  name: String!
  dateFormed: Date!
  members: [String!]!
  albums: [Album!]!
  numOfAlbums: Int
}

type Album {
  id: String!
  title: String!
  releaseDate: Date!
  genre: MusicGenre!
  artist: Artist!
  recordCompany: RecordCompany!
  songs: [String!]!
}

type RecordCompany {
  id: String!
  name: String!
  foundedYear: Int!
  country: String
  albums: [Album!]!
  numOfAlbums: Int
}

enum MusicGenre {
  POP
  ROCK
  HIP_HOP
  COUNTRY
  JAZZ
  CLASSICAL
  ELECTRONIC
  R_AND_B
  INDIE
  ALTERNATIVE
}

scalar Date
```

## Queries
My server supports several queries, including fetching all artists, albums, record companies, getting entities by ID, fetching songs by artist ID, albums by genre, companies by founded year, and searching artists by name.

## Mutations
Mutations allow us to add, edit, and remove artists, albums, and record companies. For each action, we ensure data validation (e.g., date formats, name contents) and update both MongoDB and the Redis cache accordingly.

## Caching Strategy with Redis
I use Redis to cache query results from MongoDB to improve response times for frequently accessed data. This includes caching lists of all artists, albums, record companies, individual entities by ID, songs by artist ID, albums by genre, and search results. Cache keys are carefully designed to facilitate efficient retrieval and invalidation.

## Setup and Running the Server
To run this project:

Ensure MongoDB and Redis are running on your machine.
Clone the repository and install dependencies with npm install.
Start the server with `npm start`. The GraphQL playground will be available at http://localhost:4000.
