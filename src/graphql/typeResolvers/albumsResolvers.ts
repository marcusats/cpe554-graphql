import { Album } from "../../mongodb/models/albums";
import { Artist } from "../../mongodb/models/artists";
import { Song } from "../../mongodb/models/songs";
import { Schema } from 'mongoose';
import { RecordCompany } from "../../mongodb/models/recordCompanies";
import { fetchAlbumsFromDatabase } from "../../mongodb/fetch/database";
import type { QueryResolvers, Resolvers, AlbumResolvers, MutationResolvers } from "../types";
import client from "../../redis/connect";

const transformAlbum = (albums: any[]): Resolvers['Album'][] => {
    return albums.map(album => ({
      __typename: 'Album',
      id: album._id.toString(),
      title: album.title,
      releaseDate: album.releaseDate,
      genre: album.genre.toUpperCase(), 
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
    const cacheKey = `album:${_id}`;
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
      const cacheKey = `albumsArtist:${parent.id}`;
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
      const cacheKey = `albumsRecordCompany:${parent.id}`;
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
    songs: async (parent) => {
      const cacheKey = `albumSongs:${parent.id}`;
      let cachedSongs = await client.get(cacheKey);
    
      if (cachedSongs) {
        return JSON.parse(cachedSongs);
      } else {
        const songs = await Song.find({ albumId: parent.id }).exec();
        if (!songs || songs.length === 0) return [];
    
        const transformedSongs = songs.map(song => ({
          __typename: 'Song',
          id: song._id.toString(),
          title: song.title,
          duration: song.duration,
        }));
    
        await client.set(cacheKey, JSON.stringify(transformedSongs), { EX: 3600 });
        return transformedSongs;
      }
    }
  }

  const addAlbumResolver: MutationResolvers['addAlbum'] = async (_, { title, releaseDate, genre, artistId, companyId }) => {

    if (!/^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/.test(releaseDate) || new Date(releaseDate) > new Date() || isNaN(new Date(releaseDate).getTime())) {
      throw new Error('Invalid release date.');
    }
  


  
  
    const artistExists = await Artist.findById(artistId);
    const companyExists = await RecordCompany.findById(companyId);
    if (!artistExists || !companyExists) {
      throw new Error('Artist or Company does not exist.');
    }
  

    const newAlbum = new Album({
      title,
      releaseDate: new Date(releaseDate),
      genre: genre.toUpperCase(),
      artistId,
      companyId
    });
  
    await newAlbum.save();

    const transformedAlbum = transformAlbum([newAlbum])[0]
  
  
    const cacheKey = `album:${newAlbum._id.toString()}`;
    await client.set(cacheKey, JSON.stringify(transformedAlbum), { EX: 3600 });
  
    let cachedAlbum = await client.get(cacheKey);
    if (cachedAlbum ) {
        return JSON.parse(cachedAlbum);
    }else {
      return transformedAlbum; 
    }
  };

  const editAlbumResolver: MutationResolvers['editAlbum'] = async (_, { _id, title, releaseDate, genre, artistId, companyId }) => {
    const album = await Album.findById(_id);
    if (!album) {
      throw new Error('Album not found.');
    }
  

    if (title) album.title = title;
    if (releaseDate && /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/.test(releaseDate)) album.releaseDate = new Date(releaseDate);
    if (genre) album.genre = genre.toUpperCase();
    if (artistId) album.artistId = new Schema.Types.ObjectId(artistId);
    if (companyId) album.recordCompanyId = new Schema.Types.ObjectId(companyId);
  

    await album.save();
  
    const transformedAlbum = transformAlbum([album])[0]

    const cacheKey = `album:${_id}`;
    await client.set(cacheKey, JSON.stringify(transformedAlbum), { EX: 3600 });

    
  
    let cachedAlbum = await client.get(cacheKey);
    if (cachedAlbum ) {
        return JSON.parse(cachedAlbum);
    }else {
      return transformedAlbum; 
    }
  };

  const removeAlbumResolver: MutationResolvers['removeAlbum'] = async (_, { _id }) => {
    const album = await Album.findByIdAndDelete(_id);
    if (!album) {
      throw new Error('Album not found.');
    }
  
    const cacheKey = `album:${_id}`;
    let cachedAlbum = await client.get(cacheKey);
    await client.del(cacheKey);
    await client.del('albums')
  
    const transformedAlbum = transformAlbum([album])[0]

    if (cachedAlbum ) {
        return JSON.parse(cachedAlbum);
    }else {
      return transformedAlbum; 
    }
  };

  
  





export { 
  albumsResolver, 
  albumByIdResolver, 
  albumsByGenreResolver, 
  albumTypeResolver, 
  addAlbumResolver, 
  editAlbumResolver,  
  removeAlbumResolver
};

