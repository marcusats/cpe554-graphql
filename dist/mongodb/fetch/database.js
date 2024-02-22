import { Artist } from '../models/artists.js';
async function fetchArtistsFromDatabase() {
    try {
        const artists = await Artist.find().populate('albums');
        return artists;
    }
    catch (error) {
        console.error('Failed to fetch artists from the database:', error);
        throw new Error('Failed to fetch artists');
    }
}
export { fetchArtistsFromDatabase, };
