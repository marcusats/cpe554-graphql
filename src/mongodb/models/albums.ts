import { Schema, model } from 'mongoose';

// Update the interface to reflect that songs is an array of ObjectIds
interface IAlbum {
  title: string;
  releaseDate: Date;
  genre: string;
  artistId: Schema.Types.ObjectId;
  recordCompanyId: Schema.Types.ObjectId;
  songs: Schema.Types.ObjectId[]; // Updated to use ObjectId references
}

// Update the schema definition for songs to reference 'Song' documents
const albumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
  recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song', required: true }] // Updated to reference 'Song' documents
});

const Album = model<IAlbum>('Album', albumSchema);

export {
    Album
};
