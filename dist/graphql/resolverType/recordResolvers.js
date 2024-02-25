import { Album } from '../../mongodb/models/albums.js';
import { RecordCompany } from '../../mongodb/models/recordCompanies.js';
import { fetchRecordsFromDatabase, fetchCompanyFromId } from '../../mongodb/fetch/database.js';
import client from '../../redis/connect.js';
const transformRecordCompany = (company) => {
    return company.map(company => ({
        __typename: 'RecordCompany',
        id: company._id.toString(),
        name: company.name,
        foundedYear: company.foundedYear,
        country: company.country,
        numOfAlbums: company.albums.length
    }));
};
const companysResolver = async (_, args) => {
    const cacheKey = 'recordCompanies';
    const cachedCompany = await client.get(cacheKey);
    if (cachedCompany) {
        return JSON.parse(cachedCompany);
    }
    else {
        const records = await fetchRecordsFromDatabase();
        const transformedRecords = transformRecordCompany(records);
        await client.set(cacheKey, JSON.stringify(transformedRecords), { EX: 3600 });
        return transformedRecords;
    }
};
const recordCompanyByIdResolver = async (_, { _id }) => {
    const cacheKey = `recordCompany_${_id}`;
    const cachedRecordCompany = await client.get(cacheKey);
    if (cachedRecordCompany) {
        return JSON.parse(cachedRecordCompany);
    }
    else {
        const recordCompany = await fetchCompanyFromId(_id);
        if (!recordCompany)
            return null;
        const transformedRecordCompany = transformRecordCompany([recordCompany])[0];
        await client.set(cacheKey, JSON.stringify(transformedRecordCompany));
        return transformedRecordCompany;
    }
};
const companyByFoundedYearResolver = async (_, { min, max }) => {
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
    await client.set(cacheKey, JSON.stringify(transformedCompanies), { EX: 3600 });
    return transformedCompanies;
};
const companyTypeResolver = {
    albums: async (parent) => {
        const cacheKey = `recordCompanyAlbums_${parent.id}`;
        let cachedAlbums = await client.get(cacheKey);
        if (cachedAlbums) {
            return JSON.parse(cachedAlbums);
        }
        else {
            const albums = await Album.find({ recordCompanyId: parent.id });
            if (!albums)
                return null;
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
};
export { recordCompanyByIdResolver, companysResolver, companyByFoundedYearResolver, companyTypeResolver };
