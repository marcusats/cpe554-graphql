import { Schema, model } from 'mongoose';
const songSchema = new Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    albumId: { type: Schema.Types.ObjectId, ref: 'Album' }
});
const Song = model('Song', songSchema);
export { Song };
