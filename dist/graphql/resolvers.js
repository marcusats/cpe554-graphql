import { artistsResolver, artistByIdResolver, searchArtistByArtistNameResolver, artistsTypeResolver, addArtistResolver, editArtistResolver, removeArtistResolver } from './typeResolvers/artisitsResolvers.js';
import { companysResolver, recordCompanyByIdResolver, companyByFoundedYearResolver, companyTypeResolver, editCompanyResolver, addCompanyResolver, removeCompanyResolver } from './typeResolvers/recordResolvers.js';
import { albumsResolver, albumByIdResolver, albumsByGenreResolver, albumTypeResolver, addAlbumResolver, editAlbumResolver, removeAlbumResolver } from './typeResolvers/albumsResolvers.js';
import { getSongByIdResolver, getSongsByAlbumIdResolver, searchSongByTitleResolver, songTypeResolver, addSongResolver, editSongResolver, removeSongResolver } from './typeResolvers/songResolvers.js';
const queryResolvers = {
    albums: albumsResolver,
    artists: artistsResolver,
    recordCompanies: companysResolver,
    getArtistById: artistByIdResolver,
    getAlbumById: albumByIdResolver,
    getCompanyById: recordCompanyByIdResolver,
    albumsByGenre: albumsByGenreResolver,
    companyByFoundedYear: companyByFoundedYearResolver,
    searchArtistByArtistName: searchArtistByArtistNameResolver,
    getSongById: getSongByIdResolver,
    getSongsByAlbumId: getSongsByAlbumIdResolver,
    searchSongByTitle: searchSongByTitleResolver
};
const mutationResolvers = {
    addArtist: addArtistResolver,
    editArtist: editArtistResolver,
    removeArtist: removeArtistResolver,
    addCompany: addCompanyResolver,
    editCompany: editCompanyResolver,
    removeCompany: removeCompanyResolver,
    addAlbum: addAlbumResolver,
    editAlbum: editAlbumResolver,
    removeAlbum: removeAlbumResolver,
    addSong: addSongResolver,
    editSong: editSongResolver,
    removeSong: removeSongResolver
};
const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    Album: albumTypeResolver,
    Artist: artistsTypeResolver,
    RecordCompany: companyTypeResolver,
    Song: songTypeResolver
};
export default resolvers;
