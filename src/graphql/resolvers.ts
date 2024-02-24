import type { Resolvers, QueryResolvers, MutationResolvers, AlbumResolvers} from './types';
import { 
  artistsResolver, 
  artistByIdResolver, 
  searchArtistByArtistNameResolver, 
  artistsTypeResolver,
  addArtistResolver, 
  editArtistResolver,
  removeArtistResolver
} from './typeResolvers/artisitsResolvers';
import { 
  companysResolver, 
  recordCompanyByIdResolver, 
  companyByFoundedYearResolver, 
  companyTypeResolver,
  editCompanyResolver, 
  addCompanyResolver, 
  removeCompanyResolver
} from './typeResolvers/recordResolvers';
import {  
  albumsResolver, 
  albumByIdResolver, 
  albumsByGenreResolver, 
  albumTypeResolver,
  addAlbumResolver, 
  editAlbumResolver,  
  removeAlbumResolver
} from './typeResolvers/albumsResolvers';


const queryResolvers: QueryResolvers = {
  albums: albumsResolver,
  artists: artistsResolver,
  recordCompanies: companysResolver,
  getArtistById: artistByIdResolver,
  getAlbumById: albumByIdResolver,
  getCompanyById:recordCompanyByIdResolver,
  albumsByGenre: albumsByGenreResolver,
  companyByFoundedYear: companyByFoundedYearResolver,
  searchArtistByArtistName: searchArtistByArtistNameResolver

};

const mutationResolvers: MutationResolvers = {
  addArtist: addArtistResolver, 
  editArtist: editArtistResolver,
  removeArtist: removeArtistResolver,
  addCompany: addCompanyResolver,
  editCompany: editCompanyResolver,
  removeCompany: removeCompanyResolver,
  addAlbum: addAlbumResolver,
  editAlbum: editAlbumResolver,
  removeAlbum: removeAlbumResolver
}

const resolvers: Resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    Album: albumTypeResolver,
    Artist: artistsTypeResolver,
    RecordCompany: companyTypeResolver,
  };
  
  export default resolvers;

  
  