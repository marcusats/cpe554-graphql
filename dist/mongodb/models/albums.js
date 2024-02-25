import { Schema, model } from 'mongoose';
// Update the schema definition for songs to reference 'Song' documents
const albumSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
    recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song', required: true }] // Updated to reference 'Song' documents
});
const Album = model('Album', albumSchema);
export { Album };
