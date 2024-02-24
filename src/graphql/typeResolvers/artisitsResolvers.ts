import { fetchArtistsFromDatabase, fetchArtistFromId } from "../../mongodb/fetch/database";
import type { QueryResolvers, Resolvers, ArtistResolvers, MutationResolvers } from "../types"; 
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
    const cacheKey = `artist:${_id}`;
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
      const cacheKey = `artistAlbums:${parent.id}`;
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
        }));

        await client.set(cacheKey, JSON.stringify(transformedAlbums), { EX: 3600 });
        return transformedAlbums;
      }
    },
  }

  const addArtistResolver: MutationResolvers['addArtist'] = async (_, { name, dateFormed, members }) => {
    
    console.log(`Name: '${name}'`);
    console.log(`Date Formed: '${dateFormed}'`);
    members.forEach((member, index) => console.log(`Member ${index + 1}: '${member}'`));

    if (!name.trim() || members.some(member => !member.trim() || !/^[A-Za-z]+$/.test(member))) {
      console.log('Throwing Invalid input error');
      throw new Error('Invalid input');
    }


    if (!/^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/.test(dateFormed)) {
      throw new Error('Invalid date');
    }
    
    const parsedDate = new Date(dateFormed);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }

   
    const newArtist = new Artist({
      name,
      dateFormed: parsedDate,
      members,
      albums: [] 
    });
    
    await newArtist.save();

    const cacheKey = `artist:${newArtist._id.toString()}`;

    const transformedArtist = transformArtists([newArtist])[0]

    await client.set(cacheKey, JSON.stringify(transformedArtist), { EX: 3600 });

    let cachedArtists = await client.get(cacheKey);
    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    }else {
      return transformedArtist; 
    }
    
   
  }
  const editArtistResolver: MutationResolvers['editArtist']  = async (_, { _id, name, dateFormed, members }) => {
   
    if (name && name.trim().length === 0) throw new Error('Name cannot be empty or just spaces.');
    if (dateFormed && !/^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/.test(dateFormed)) {
      throw new Error('Invalid date format.');
    }
    const parsedDate = dateFormed ? new Date(dateFormed) : undefined;
    if (parsedDate && isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date.');
    }
    if (members && !members.every(member => /^[A-Za-z]+$/.test(member))) {
      throw new Error('Members should only contain letters A-Z.');
    }
  
    
    const artist = await Artist.findById(_id);
    if (!artist) throw new Error('Artist not found.');
    if (name) artist.name = name;
    if (parsedDate) artist.dateFormed = parsedDate;
    if (members) artist.members = members;
    
    await artist.save();

    const transformedArtist = transformArtists([artist])[0]
  
    const cacheKey = `artist:${_id}`;
    const artistData = JSON.stringify(transformedArtist);
    await client.set(cacheKey, artistData, { EX: 3600 }); 

    let cachedArtists = await client.get(cacheKey);
    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    }else {
      return transformedArtist; 
    } 
  };

  const removeArtistResolver: MutationResolvers['removeArtist'] = async (_, { _id }) => {
    const artist = await Artist.findById(_id);
    if (!artist) {
      throw new Error('Artist not found.');
    }
  
    await Artist.deleteOne({ _id });
  
    const albums = await Album.find({ artistId: _id });
    const albumIds = albums.map(album => album._id);
    await Album.deleteMany({ artistId: _id });
   
    
    albumIds.forEach(async (albumId) => {
      const albumCacheKey = `album:${albumId}`;
      await client.del(albumCacheKey);
    });


    const transformedArtist = transformArtists([artist])[0]

    const artistCacheKey = `artist:${_id}`;
    let cachedArtists = await client.get(artistCacheKey);

    await client.del(artistCacheKey);

    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    }else {
      return transformedArtist; 
    } 
  };

  


export { 
  artistsResolver, 
  artistByIdResolver, 
  searchArtistByArtistNameResolver, 
  artistsTypeResolver, 
  addArtistResolver, 
  editArtistResolver,
  removeArtistResolver
};

