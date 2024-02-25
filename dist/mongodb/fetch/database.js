import { Artist } from '../models/artists.js';
import { RecordCompany } from '../models/recordCompanies.js';
import { Album } from '../models/albums.js';
async function fetchArtistsFromDatabase() {
    try {
        const artists = await Artist.find();
        return artists;
    }
    catch (error) {
        console.error('Failed to fetch artists from the database:', error);
        throw new Error('Failed to fetch artists');
    }
}
async function fetchArtistFromId(_id) {
    try {
        const artist = await Artist.findById(_id);
        return artist;
    }
    catch (error) {
        console.error('Failed to fetch artists from the database:', error);
        throw new Error('Failed to fetch artists');
    }
}
async function fetchRecordsFromDatabase() {
    try {
        const recordCompanies = await RecordCompany.find();
        return recordCompanies;
    }
    catch (error) {
        console.error('Failed to fetch record companies from the database:', error);
        throw new Error('Failed to fetch record companies');
    }
}
async function fetchCompanyFromId(_id) {
    try {
        const recordCompanie = await RecordCompany.findById(_id);
        return recordCompanie;
    }
    catch (error) {
        console.error('Failed to fetch record companies from the database:', error);
        throw new Error('Failed to fetch record companies');
    }
}
async function fetchAlbumsFromDatabase() {
    try {
        const albums = await Album.find();
        return albums;
    }
    catch (error) {
        console.error('Failed to fetch albums from the database:', error);
        throw new Error('Failed to fetch albums');
    }
}
async function fetchAlbumFromId(_id) {
    try {
        const album = await Album.findById(_id);
        return album;
    }
    catch (error) {
        console.error('Failed to fetch albums from the database:', error);
        throw new Error('Failed to fetch albums');
    }
}
export { fetchArtistsFromDatabase, fetchRecordsFromDatabase, fetchAlbumsFromDatabase, fetchArtistFromId, fetchCompanyFromId, fetchAlbumFromId };
