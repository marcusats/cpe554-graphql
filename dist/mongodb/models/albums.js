import { Schema, model } from 'mongoose';
const albumSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
    recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
    songs: [{ type: String, required: true }]
});
const Album = model('Album', albumSchema);
export { Album };
