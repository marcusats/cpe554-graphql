// prepopulate.js
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const artistSchema = new Schema({
  name: { type: String, required: true },
  dateFormed: { type: Date, required: true },
  members: [{ type: String, required: true }],
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const Artist = model('Artist', artistSchema);


const albumSchema = new Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
  recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song', required: true }]
});
const Album = model('Album', albumSchema);


const recordCompanySchema = new Schema({
  name: { type: String, required: true },
  foundedYear: { type: Number, required: true },
  country: { type: String },
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const RecordCompany = model('RecordCompany', recordCompanySchema);

const songSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album' }
});

const Song = model('Song', songSchema);

const mongodbConnectionStr = "";


mongoose.connect(mongodbConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


async function createSampleData() {
 
  const rockstarRecords = await new RecordCompany({ name: "Rockstar Records", foundedYear: 1975, country: "USA" }).save();
  const jazzFusionLtd = await new RecordCompany({ name: "JazzFusion Ltd.", foundedYear: 1980, country: "UK" }).save();


  const theRockLegends = await new Artist({ name: "The Rock Legends", dateFormed: new Date("1965-07-01"), members: ["Member A", "Member B"] }).save();
  const jazzMasters = await new Artist({ name: "Jazz Masters", dateFormed: new Date("1970-01-01"), members: ["Member C", "Member D"] }).save();


  const albumRock = await new Album({
    title: "Rocking The World",
    releaseDate: new Date("1982-05-15"),
    genre: "Rock",
    artistId: theRockLegends._id,
    recordCompanyId: rockstarRecords._id,
    songs: [] 
  }).save();

  const albumJazz = await new Album({
    title: "Jazz in the Night",
    releaseDate: new Date("1985-11-20"),
    genre: "Jazz",
    artistId: jazzMasters._id,
    recordCompanyId: jazzFusionLtd._id,
    songs: [] 
  }).save();

  const song1 = await new Song({ title: "Rock Anthem", duration: "03:45", albumId: albumRock._id }).save();
  const song2 = await new Song({ title: "The Legends Continue", duration: "04:20", albumId: albumRock._id }).save();
  const song3 = await new Song({ title: "Smooth Jazz Intro", duration: "05:10", albumId: albumJazz._id }).save();
  const song4 = await new Song({ title: "Night Groove", duration: "06:30", albumId: albumJazz._id }).save();


  await Album.findByIdAndUpdate(albumRock._id, { $push: { songs: [song1._id, song2._id] } });
  await Album.findByIdAndUpdate(albumJazz._id, { $push: { songs: [song3._id, song4._id] } });

  await Artist.findByIdAndUpdate(theRockLegends._id, { $set: { albums: [albumRock._id], recordCompany: rockstarRecords._id } });
  await Artist.findByIdAndUpdate(jazzMasters._id, { $set: { albums: [albumJazz._id], recordCompany: jazzFusionLtd._id } });

  await RecordCompany.findByIdAndUpdate(rockstarRecords._id, { $set: { albums: [albumRock._id]} });
  await RecordCompany.findByIdAndUpdate(jazzFusionLtd._id, { $set: { albums: [albumJazz._id] } });

  console.log('Sample data created with multiple record companies, artists, and albums.');

  const testalbums = await Album.find()

  console.log("TEST:",testalbums[0])
}


createSampleData()
  .then(() => mongoose.disconnect())
  .catch(err => console.error('Failed to create sample data:', err));