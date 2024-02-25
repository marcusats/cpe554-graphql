import { fetchArtistsFromDatabase, fetchArtistFromId } from "../../mongodb/fetch/database";
import type { QueryResolvers, Resolvers, ArtistResolvers } from "../types"; 
import { Artist } from "../../mongodb/models/artists";
import { Album  } from "../../mongodb/models/albums";
import client from "../../redis/connect";



const transformArtists = (artists: any[]): Resolvers['Artist'][] => {
    return artists.map(artist => ({
      __typename: 'Artist', 
      id: artist._id.toString(),
      name: artist.name,
      dateFormed: artist.dateFormed,
      members: artist.members,
      numOfAlbums: artist.albums.length
    }));
};



const artistsResolver: QueryResolvers['artists'] = async (_, args) => {
    const cacheKey = 'artists';
    const cachedArtists = await client.get(cacheKey);

    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    } else {
        const artists = await fetchArtistsFromDatabase();
        const transformedArtists = transformArtists(artists)

        await client.set(cacheKey, JSON.stringify(transformedArtists), { EX: 3600 });

        return transformedArtists;
    }
};

const artistByIdResolver: QueryResolvers['getArtistById'] = async (_, { _id }) => {
    const cacheKey = `artist_${_id}`;
    const cachedArtist = await client.get(cacheKey);

    if (cachedArtist) {
        return JSON.parse(cachedArtist);
    } else {
        const artist = await fetchArtistFromId(_id); 
        if (!artist) return null;
        const transformedArtist = transformArtists([artist])[0];

        await client.set(cacheKey, JSON.stringify(transformedArtist));

        return transformedArtist;
    }
}
const searchArtistByArtistNameResolver: QueryResolvers['searchArtistByArtistName'] = async (_, {  searchTerm  }) => {
    if (!searchTerm.trim()) {
        throw new Error("Search term cannot be empty");
    }

    const cacheKey = `artists:search:${searchTerm.toLowerCase()}`;

    
    let cachedArtists = await client.get(cacheKey);
    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    }

    let artistsFromDb = await Artist.find({
        name: { $regex: searchTerm, $options: 'i' } 
    }).exec();

    const transformedArtists = transformArtists(artistsFromDb);

    await client.set(cacheKey, JSON.stringify(transformedArtists), {EX: 3600}); 

    return transformedArtists;

}
const artistsTypeResolver: ArtistResolvers = {
    albums: async (parent) => {
      const cacheKey = `artistAlbums_${parent.id}`;
      let cachedAlbums = await client.get(cacheKey);

      if (cachedAlbums) {
        return JSON.parse(cachedAlbums);
      } else {
        const albums = await Album.find({ artistId: parent.id }).exec();
        if (!albums) return null;
        const transformedAlbums = albums.map(album => ({
          __typename: 'Album', 
          id: album._id.toString(),
          title: album.title,
          releaseDate: album.releaseDate.toISOString(),
          genre: album.genre.toUpperCase(),
          songs: album.songs,
        }));

        await client.set(cacheKey, JSON.stringify(transformedAlbums), { EX: 3600 });
        return transformedAlbums;
      }
    },
  }


export { artistsResolver, artistByIdResolver, searchArtistByArtistNameResolver, artistsTypeResolver};

