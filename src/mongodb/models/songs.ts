import { Schema, model } from 'mongoose';

interface ISong {
  title: string;
  duration: string;
  albumId: Schema.Types.ObjectId;
}

const songSchema = new Schema<ISong>({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album' }
});

const Song = model<ISong>('Song', songSchema);

export {
    Song
};
