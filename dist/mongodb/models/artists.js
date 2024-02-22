import { Schema, model } from 'mongoose';
const artistSchema = new Schema({
    name: { type: String, required: true },
    dateFormed: { type: Date, required: true },
    members: [{ type: String, required: true }],
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const Artist = model('Artist', artistSchema);
export { Artist };
