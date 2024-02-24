import { Album } from "../../mongodb/models/albums";
import { RecordCompany } from "../../mongodb/models/recordCompanies";
import { fetchRecordsFromDatabase, fetchCompanyFromId} from "../../mongodb/fetch/database";
import type { QueryResolvers, Resolvers, RecordCompanyResolvers, MutationResolvers } from "../types";  
import client from "../../redis/connect";

const transformRecordCompany = (company: any[]): Resolvers['RecordCompany'][] => {
    return company.map(company=> ({
      __typename: 'RecordCompany', 
      id: company._id.toString(),
      name: company.name,
      foundedYear: company.foundedYear,
      country: company.country,
      numOfAlbums: company.albums.length
    }));
};


const companysResolver: QueryResolvers['recordCompanies'] = async (_, args) => {
    const cacheKey = 'recordCompanies';
    const cachedCompany = await client.get(cacheKey);

    if (cachedCompany) {
        return JSON.parse(cachedCompany);
    } else {
        const records = await fetchRecordsFromDatabase();
        const transformedRecords = transformRecordCompany(records)

        await client.set(cacheKey, JSON.stringify(transformedRecords), { EX: 3600 });

        return transformedRecords;
    }
};

const recordCompanyByIdResolver: QueryResolvers['getCompanyById'] = async (_, { _id }) => {
    const cacheKey = `recordCompany:${_id}`;
    const cachedRecordCompany = await client.get(cacheKey);

    if (cachedRecordCompany) {
        return JSON.parse(cachedRecordCompany);
    } else {
        const recordCompany = await fetchCompanyFromId(_id); 
        if (!recordCompany) return null;
        const transformedRecordCompany = transformRecordCompany([recordCompany])[0];

        await client.set(cacheKey, JSON.stringify(transformedRecordCompany));

        return transformedRecordCompany;
    }
}
const companyByFoundedYearResolver: QueryResolvers['companyByFoundedYear'] = async (_, { min, max }) => {
  if (min < 1900 || max > 2025 || min >= max) {
    throw new Error("Invalid year range");
  }

  const cacheKey = `companies:founded:${min}-${max}`;


  let cachedCompanies = await client.get(cacheKey);
  if (cachedCompanies) {
    return JSON.parse(cachedCompanies);
  }

  let companies = await RecordCompany.find({
    foundedYear: { $gte: min, $lte: max }
  }).exec();

  
  const transformedCompanies = transformRecordCompany(companies);
  
  await client.set(cacheKey, JSON.stringify(transformedCompanies),{ EX: 3600}); 

  return transformedCompanies;
}

const companyTypeResolver: RecordCompanyResolvers = {
  albums: async (parent) => {
    const cacheKey = `recordCompanyAlbums:${parent.id}`;
    let cachedAlbums = await client.get(cacheKey);

    if (cachedAlbums) {
      return JSON.parse(cachedAlbums);
    } else {
      const albums = await Album.find({ recordCompanyId: parent.id });
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

const addCompanyResolver: MutationResolvers['addCompany'] = async (_, { name, foundedYear, country }) => {

  if (foundedYear < 1900 || foundedYear >= 2025) {
    throw new Error('Founded year must be between 1900 and 2024.');
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    throw new Error('Name must only contain letters A-Z.');
  }
    
  const newCompany = new RecordCompany({
    name,
    foundedYear: foundedYear,
    country: country,
    albums: [] 
  });
  
  await newCompany.save();

  const cacheKey = `recordCompany:${newCompany._id.toString()}`;

  const transformedCompany = transformRecordCompany([newCompany])[0]

  await client.set(cacheKey, JSON.stringify(transformedCompany), { EX: 3600 });

  let cachedCompany = await client.get(cacheKey);
  if (cachedCompany ) {
      return JSON.parse(cachedCompany);
  }else {
    return transformedCompany; 
  }
  
 
}
const editCompanyResolver: MutationResolvers['editCompany'] = async (_, { _id, name, foundedYear, country }) => {
  
  if (foundedYear !== undefined && (foundedYear < 1900 || foundedYear >= 2025)) {
    throw new Error('Founded year must be between 1900 and 2024.');
  }


  if (name && !/^[A-Za-z\s]+$/.test(name)) {
    throw new Error('Name must only contain letters A-Z.');
  }

  const recordCompany = await RecordCompany.findById(_id);
  if (!recordCompany) {
    throw new Error('RecordCompany not found.');
  }


  if (name !== undefined) recordCompany.name = name;
  if (foundedYear !== undefined) recordCompany.foundedYear = foundedYear;
  if (country !== undefined) recordCompany.country = country;

  
  await recordCompany.save();


  const cacheKey = `recordCompany:${_id}`;
  const transformedCompany = transformRecordCompany([recordCompany])[0]

  await client.set(cacheKey, JSON.stringify(transformedCompany), { EX: 3600 });

  let cachedCompany = await client.get(cacheKey);
  if (cachedCompany ) {
      return JSON.parse(cachedCompany);
  }else {
    return transformedCompany; 
  }
};

const removeCompanyResolver: MutationResolvers['removeCompany'] = async (_, { _id }) => {
  // Fetch the record company to be deleted
  const recordCompany = await RecordCompany.findById(_id);
  if (!recordCompany) {
    throw new Error('RecordCompany not found.');
  }

  // Delete all albums distributed by this record company
  const albums = await Album.find({ recordCompanyId: _id });
  for (let album of albums) {
    await Album.findByIdAndDelete(album._id); 
    await client.del(`album:${album._id.toString()}`);
  }

  await RecordCompany.findByIdAndDelete(_id); 
  const cacheKey = `recordCompany:${_id}`;
  let cachedCompany = await client.get(cacheKey);
  await client.del(`cacheKey`);

  const transformedCompany = transformRecordCompany([recordCompany])[0]

  if (cachedCompany ) {
    return JSON.parse(cachedCompany);
  }else {
    return transformedCompany; 
  }
};




export {
  recordCompanyByIdResolver, 
  companysResolver, 
  companyByFoundedYearResolver, 
  companyTypeResolver, 
  editCompanyResolver, 
  addCompanyResolver, 
  removeCompanyResolver
}