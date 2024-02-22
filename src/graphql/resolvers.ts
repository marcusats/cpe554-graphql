import { fetchArtistsFromDatabase } from "../mongodb/fetch/database";
import type { Resolvers, Artist } from "./types";

const resolvers: Resolvers = {
    Query: {
      artists: async (_, args, { redisClient }) => {

        const cacheKey = 'artists';
        const cachedArtists = await redisClient.get(cacheKey);
  
        if (cachedArtists) {
          return JSON.parse(cachedArtists);
        } else {

          const artists = await fetchArtistsFromDatabase();
          let newArtist: Artist;
          newArtist.id
          console.log(artists)
          await redisClient.set(cacheKey, JSON.stringify(artists), 'EX', 3600);
  
          return artists;
        }
      },
      // albums: async (_, args, context) => {
      //   // Implement logic to fetch albums
      // },
      // recordCompanies: async (_, args, context) => {
      //   // Implement logic to fetch record companies
      // },
      // getArtistById: async (_, { _id }, context) => {
      //   // Implement logic to fetch a single artist by ID
      // },
      // getAlbumById: async (_, { _id }, context) => {
      //   // Implement logic to fetch a single album by ID
      // },
      // getCompanyById: async (_, { _id }, context) => {
      //   // Implement logic to fetch a single record company by ID
      // },
      // getSongsByArtistId: async (_, { artistId }, context) => {
      //   // Implement logic to fetch songs by artist ID
      // },
      // albumsByGenre: async (_, { genre }, context) => {
      //   // Implement logic to fetch albums by genre
      // },
      // companyByFoundedYear: async (_, { min, max }, context) => {
      //   // Implement logic to fetch companies by founded year range
      // },
      // searchArtistByArtistName: async (_, { searchTerm }, context) => {
      //   // Implement logic to search artists by name
      // },
    },
    // You might also define resolvers for custom scalars, if necessary
    // Date: {
    //   // Serialization and parsing logic for the Date scalar
    // },
    // Plus any necessary resolvers for handling the relationships between types, e.g., resolving an artist for an album
  };
  
  export default resolvers;

  
  