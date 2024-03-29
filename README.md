# CS-554: GraphQL Server with Apollo, Redis, and MongoDB

## Overview
In this project for CS-554, we're tasked with building a GraphQL server leveraging Apollo Server, Redis for caching, and MongoDB as our data storage. Our application focuses on managing and querying data related to artists, albums, record companies ans songs.

## Database Schema
Our MongoDB setup involves three primary collections: `artists`, `albums`, `recordcompanies`, and `songs` structured as follows:

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
  "songs": ["array_of_songs_ids"]
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
### Songs Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "duration": "string",
  "albums": "ObjectId"
}
```



## Schema Definitions
I define three main GraphQL types (`Artist`, `Album`, `RecordCompany` and `Song`) along with queries and mutations to interact with our data.

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

type Song { 
 id: String! 
 title: String! 
 duration: String! 
 album: Album! 
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
```graphql
type Query {
    artists: [Artist]
    albums: [Album]
    recordCompanies: [RecordCompany]
    getArtistById(_id: String!): Artist
    getAlbumById(_id: String!): Album
    getCompanyById(_id: String!): RecordCompany
    getSongsByArtistId(artistId: String!): [String]
    albumsByGenre(genre: MusicGenre!): [Album]
    companyByFoundedYear(min: Int!, max: Int!): [RecordCompany]
    searchArtistByArtistName(searchTerm: String!): [Artist]
    getSongById(_id: String!): Song 
    getSongsByAlbumId(_id: String!): [Song]
    searchSongByTitle (searchTitleTerm: String!): [Song]
}
```

## Mutations
Mutations allow us to add, edit, and remove artists, albums, and record companies. For each action, ensures data validation (e.g., date formats, name contents) and update both MongoDB and the Redis cache accordingly.
```graphql
type Mutation {
  addArtist(name: String!, dateFormed: Date!, members: [String!]!): Artist
  editArtist(_id: String!, name: String, dateFormed: Date, members: [String!]): Artist
  removeArtist(_id: String!): Artist
  addCompany(name: String!, foundedYear: Int!, country: String!): RecordCompany
  editCompany(_id: String!, name: String, foundedYear: Int, country: String): RecordCompany
  removeCompany(_id: String!): RecordCompany
  addAlbum(title: String!, releaseDate: Date!, genre: MusicGenre!, songs: [String!]!, artistId: String!, companyId: String!): Album
  editAlbum(_id: String!, title: String, releaseDate: Date, genre: MusicGenre, songs: [String!], artistId: String, companyId: String): Album
  removeAlbum(_id: String!): Album
  addSong(title: String!, duration: String!, albumId: String!): Song
  editSong(_id: String!, title: String, duration: String, albumId: String): Song
  removeSong(_id: String!): Song
}

```

## Caching Strategy with Redis
I use Redis to cache query results from MongoDB to improve response times for frequently accessed data. This includes caching lists of all artists, albums, record companies, individual entities by ID, songs by artist ID, albums by genre, and search results. Cache keys are carefully designed to facilitate efficient retrieval and invalidation.

## Setup and Running the Server
To run this project:

Ensure MongoDB and Redis are running on your machine.
Clone the repository and install dependencies with npm install.
Start the server with `npm start`. The GraphQL playground will be available at http://localhost:4000.

## Prepopulating the Database

Before starting the server, you might want to prepopulate your MongoDB database with some initial data for artists, albums, record companies, and songs. This can help you test and interact with your GraphQL API more effectively right from the start.

I have provided a script that automatically creates sample data in your MongoDB database. This script creates multiple record companies, artists, albums, and songs, and establishes the necessary relationships between them.

### Running the Prepopulate Script

To run the prepopulate script, ensure that your MongoDB instance is running and accessible. Then, execute the following command in your terminal:

```bash
npm run prepopulate
```

This command is defined in the package.json file of the project and executes the prepopulate.js script, which connects to your MongoDB database and inserts the sample data.

Make sure you have properly set up your MongoDB connection string in the prepopulate.js script or through your environment variables, depending on how you've configured your project.

After running this command, your database will be populated with the sample data, and you will see a message indicating the successful creation of the data in your terminal. Now, you can start your GraphQL server and begin querying your prepopulated data.
