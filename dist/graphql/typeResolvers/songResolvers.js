import { Album } from '../../mongodb/models/albums.js';
import { Song } from '../../mongodb/models/songs.js';
import { Schema } from 'mongoose';
import client from '../../redis/connect.js';
const transformSongs = (songs) => {
    return songs.map(song => ({
        __typename: 'Song',
        id: song._id.toString(),
        title: song.title,
        duration: song.duration,
    }));
};
const getSongByIdResolver = async (_, { _id }) => {
    const cacheKey = `song:${_id}`;
    try {
        const cachedSong = await client.get(cacheKey);
        if (cachedSong)
            return JSON.parse(cachedSong);
        const song = await Song.findById(_id);
        if (!song)
            throw new Error('Song not found');
        const transformedSong = transformSongs([song])[0];
        await client.set(cacheKey, JSON.stringify(transformedSong));
        return transformedSong;
    }
    catch (error) {
        console.error('Failed to fetch song:', error);
        throw new Error('Failed to fetch song');
    }
};
const getSongsByAlbumIdResolver = async (_, { _id }) => {
    const cacheKey = `song:album:${_id}`;
    try {
        const cachedSong = await client.get(cacheKey);
        if (cachedSong)
            return JSON.parse(cachedSong);
        const songs = await Song.find({ albumId: _id }).exec();
        if (!songs)
            throw new Error('Song not found');
        const transformedSongs = transformSongs(songs);
        await client.set(cacheKey, JSON.stringify(transformedSongs));
        return transformedSongs;
    }
    catch (error) {
        console.error('Error fetching songs by album ID:', error);
        throw new Error('Failed to fetch songs');
    }
};
const searchSongByTitleResolver = async (_, { searchTitleTerm }) => {
    if (!searchTitleTerm.trim()) {
        throw new Error("Search term cannot be empty or just spaces.");
    }
    const searchTermLowercase = searchTitleTerm.toLowerCase();
    const cacheKey = `song:title:${searchTermLowercase}`;
    try {
        const cachedSongs = await client.get(cacheKey);
        if (cachedSongs)
            return JSON.parse(cachedSongs);
        const songs = await Song.find({
            title: { $regex: new RegExp(searchTitleTerm, 'i') }
        }).exec();
        if (!songs)
            throw new Error('No songs found matching search term.');
        const transformedSongs = transformSongs(songs);
        await client.set(cacheKey, JSON.stringify(transformedSongs), { EX: 3600 });
        return transformedSongs;
    }
    catch (error) {
        console.error('Error searching songs by title:', error);
        throw new Error('Failed to search songs by title');
    }
};
const songTypeResolver = {
    album: async (parent) => {
        const cacheKey = `album:forSong:${parent.id}`;
        try {
            let cachedAlbum = await client.get(cacheKey);
            if (cachedAlbum) {
                return JSON.parse(cachedAlbum);
            }
            else {
                const album = await Album.findOne({ songs: parent.id }).exec();
                if (!album)
                    throw new Error('Album not found for the song');
                const transformedAlbum = {
                    __typename: 'Album',
                    id: album._id.toString(),
                    title: album.title,
                    releaseDate: album.releaseDate.toISOString(),
                    genre: album.genre.toUpperCase(),
                };
                await client.set(cacheKey, JSON.stringify(transformedAlbum), { EX: 3600 });
                return transformedAlbum;
            }
        }
        catch (error) {
            console.error('Error resolving album for song:', error);
            throw new Error('Failed to resolve album for song');
        }
    },
};
const addSongResolver = async (_, { title, duration, albumId }) => {
    if (!title.trim()) {
        console.log('Throwing Invalid input error for title');
        throw new Error('Title cannot be empty or just spaces.');
    }
    if (!/^\d{2}:\d{2}$/.test(duration)) {
        console.log('Throwing Invalid input error for duration');
        throw new Error('Invalid duration format. Expected "MM:SS".');
    }
    const album = await Album.findById(albumId);
    if (!album) {
        console.log('Album not found with the provided ID');
        throw new Error('Album not found with the provided ID.');
    }
    const newSong = new Song({
        title,
        duration,
        albumId
    });
    await newSong.save();
    album.songs.push(new Schema.ObjectId(newSong._id.toString()));
    await album.save();
    const cacheKey = `song:${newSong._id.toString()}`;
    const transformedSong = transformSongs([newSong])[0];
    await client.set(cacheKey, JSON.stringify(transformedSong), { EX: 3600 });
    let cachedSong = await client.get(cacheKey);
    if (cachedSong) {
        return JSON.parse(cachedSong);
    }
    else {
        return transformedSong;
    }
};
const editSongResolver = async (_, { _id, title, duration, albumId }, { client }) => {
    const song = await Song.findById(_id);
    if (!song)
        throw new Error('Song not found.');
    if (title && !title.trim())
        throw new Error('Title cannot be empty or just spaces.');
    if (duration && !/^\d{2}:\d{2}$/.test(duration))
        throw new Error('Invalid duration format. Please use MM:SS format.');
    if (albumId) {
        const album = await Album.findById(albumId);
        if (!album)
            throw new Error('Album not found with the provided ID.');
        song.albumId = new Schema.Types.ObjectId(albumId);
    }
    if (title)
        song.title = title;
    if (duration)
        song.duration = duration;
    await song.save();
    const cacheKey = `song:${_id}`;
    await client.set(cacheKey, JSON.stringify(song), { EX: 3600 });
    const transformedSong = transformSongs([song])[0];
    let cachedSong = await client.get(cacheKey);
    if (cachedSong) {
        return JSON.parse(cachedSong);
    }
    else {
        return transformedSong;
    }
};
const removeSongResolver = async (_, { _id }) => {
    const song = await Song.findById(_id);
    if (!song) {
        throw new Error('Song not found');
    }
    await Song.findByIdAndDelete(_id);
    const cacheKey = `song:${_id}`;
    const isCached = await client.exists(cacheKey);
    let cachedSong = await client.get(cacheKey);
    if (isCached) {
        await client.del(cacheKey);
    }
    const transformedSong = transformSongs([song])[0];
    if (cachedSong) {
        return JSON.parse(cachedSong);
    }
    else {
        return transformedSong;
    }
};
export { getSongByIdResolver, getSongsByAlbumIdResolver, searchSongByTitleResolver, songTypeResolver, addSongResolver, editSongResolver, removeSongResolver };
