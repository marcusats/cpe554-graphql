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
    songs: [String!]!
  }

  type RecordCompany {
    id: String!
    name: String!
    foundedYear: Int!
    country: String
    albums: [Album!]
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
  }
`;

export {
  typeDefs
};
