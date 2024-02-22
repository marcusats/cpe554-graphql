import { Schema, model } from 'mongoose';

interface IAlbum {
  title: string;
  releaseDate: Date;
  genre: string;
  artistId: Schema.Types.ObjectId;
  recordCompanyId: Schema.Types.ObjectId;
  songs: string[];
}

const albumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
  recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
  songs: [{ type: String, required: true }]
});

const Album = model<IAlbum>('Album', albumSchema);

export {
    Album
}
