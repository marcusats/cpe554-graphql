import { Schema, model } from 'mongoose';
const recordCompanySchema = new Schema({
    name: { type: String, required: true },
    foundedYear: { type: Number, required: true },
    country: { type: String, required: false },
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const RecordCompany = model('RecordCompany', recordCompanySchema);
export { RecordCompany };
