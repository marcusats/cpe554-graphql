const typeDefs = `#graphql
type Artist {
  id: String!
  name: String!
  dateFormed: Date!
  members: [String!]!
  albums: [Album!]
  numOfAlbums: Int
}

type Album {
id: String!
title: String!
releaseDate: Date!
genre: MusicGenre!
artist: Artist!
recordCompany: RecordCompany!
songs: [Song!]!
}

type RecordCompany {
  id: String!
  name: String!
  foundedYear: Int!
  country: String
  albums: [Album!]
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
`;
export { typeDefs };
