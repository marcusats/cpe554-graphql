import { Schema, model } from 'mongoose';

interface IArtist {
  name: string;
  dateFormed: Date;
  members: string[];
  albums: Schema.Types.ObjectId[];
}

const artistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  dateFormed: { type: Date, required: true },
  members: [{ type: String, required: true }],
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});

const Artist = model<IArtist>('Artist', artistSchema);

export {
    Artist
}