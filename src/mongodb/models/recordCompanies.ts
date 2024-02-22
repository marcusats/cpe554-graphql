import { Schema, model } from 'mongoose';

interface IRecordCompany {
  name: string;
  foundedYear: number;
  country: string;
  albums: Schema.Types.ObjectId[];
}

const recordCompanySchema = new Schema<IRecordCompany>({
  name: { type: String, required: true },
  foundedYear: { type: Number, required: true },
  country: { type: String, required: false },
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});

const RecordCompany = model<IRecordCompany>('RecordCompany', recordCompanySchema);

export {
    RecordCompany
}
