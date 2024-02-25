import { Album } from "../../mongodb/models/albums";
import { Artist } from "../../mongodb/models/artists";
import { RecordCompany } from "../../mongodb/models/recordCompanies";
import { fetchAlbumsFromDatabase } from "../../mongodb/fetch/database";
import type { QueryResolvers, Resolvers, AlbumResolvers } from "../types";
import client from "../../redis/connect";

const transformAlbum = (albums: any[]): Resolvers['Album'][] => {
    return albums.map(album => ({
      __typename: 'Album',
      id: album._id.toString(),
      title: album.title,
      releaseDate: album.releaseDate,
      genre: album.genre.toUpperCase(), 
      songs: album.songs,
    }));
};

const albumsResolver: QueryResolvers['albums'] = async (_, args) => {
    const cacheKey = 'albums';
    const cachedAlbums = await client.get(cacheKey);

    if (cachedAlbums) {
        return JSON.parse(cachedAlbums);
    } else {
        const albums = await fetchAlbumsFromDatabase();
        const transformedAlbums = transformAlbum(albums);

        await client.set(cacheKey, JSON.stringify(transformedAlbums), { EX: 3600 });

        return transformedAlbums;
    }
};

const albumByIdResolver: QueryResolvers['getAlbumById'] = async (_, { _id }) => {
    const cacheKey = `album_${_id}`;
    const cachedAlbum = await client.get(cacheKey);

    if (cachedAlbum) {
        return JSON.parse(cachedAlbum);
    } else {
        const album = await Album.findById(_id); 
        if (!album) return null;
        const transformedAlbum = transformAlbum([album])[0];

        await client.set(cacheKey, JSON.stringify(transformedAlbum));

        return transformedAlbum;
    }
}
const albumsByGenreResolver: QueryResolvers['albumsByGenre'] = async (_, { genre }) => {
    if (!genre.trim()) {
        throw new Error("Genre cannot be empty or just spaces.");
    }

    const normalizedGenre = genre.toLowerCase();
    const cacheKey = `albumsByGenre:${normalizedGenre}`;

    let cachedAlbums = await client.get(cacheKey);
    if (cachedAlbums) {
        return JSON.parse(cachedAlbums);
    }

    const albumsFromDb = await Album.find({ genre: new RegExp(normalizedGenre, 'i') }).exec();
    const transformedAlbums = transformAlbum(albumsFromDb);

   
    await client.set(cacheKey, JSON.stringify(transformedAlbums), {EX: 3600}); 

    return transformedAlbums;
}

const albumTypeResolver: AlbumResolvers = {
    artist: async (parent) => {
      const cacheKey = `artist_${parent.id}`;
      let cachedArtist = await client.get(cacheKey);
  
      if (cachedArtist) {
        return JSON.parse(cachedArtist);
      } else {
        const artist = await Artist.findOne({ "albums": parent.id }).exec();
        if (!artist) return null;
  
        const newArtist: any = {
          __typename: 'Artist',
          id: artist._id.toString(),
          name: artist.name,
          dateFormed: artist.dateFormed,
          members: artist.members,
          numOfAlbums: artist.albums.length,
        };
  
        await client.set(cacheKey, JSON.stringify(newArtist), { EX: 3600 });
        return newArtist;
      }
    },
    recordCompany: async (parent) => {
      const cacheKey = `recordCompany_${parent.id}`;
      let cachedRecordCompany = await client.get(cacheKey);
  
      if (cachedRecordCompany) {
        return JSON.parse(cachedRecordCompany);
      } else {
        const recordCompany = await RecordCompany.findOne({ "albums": parent.id }).exec();
        if (!recordCompany) return null;
  
        const newRecordCompany: any = {
          __typename: 'RecordCompany',
          id: recordCompany._id.toString(),
          name: recordCompany.name,
          foundedYear: recordCompany.foundedYear,
          country: recordCompany.country,
        };
  
        await client.set(cacheKey, JSON.stringify(newRecordCompany), { EX: 3600 });
        return newRecordCompany;
      }
    },
  }
  




export { albumsResolver, albumByIdResolver, albumsByGenreResolver, albumTypeResolver };

