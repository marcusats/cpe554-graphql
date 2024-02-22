// prepopulate.js
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// Artist Schema
const artistSchema = new Schema({
  name: { type: String, required: true },
  dateFormed: { type: Date, required: true },
  members: [{ type: String, required: true }],
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const Artist = model('Artist', artistSchema);

// Album Schema
const albumSchema = new Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist' },
  recordCompanyId: { type: Schema.Types.ObjectId, ref: 'RecordCompany' },
  songs: [{ type: String, required: true }]
});
const Album = model('Album', albumSchema);

// RecordCompany Schema
const recordCompanySchema = new Schema({
  name: { type: String, required: true },
  foundedYear: { type: Number, required: true },
  country: { type: String },
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
});
const RecordCompany = model('RecordCompany', recordCompanySchema);

// MongoDB Connection String
const mongodbConnectionStr = "mongodb+srv://marcos:pVFDWJ891cRDz53g@cluster0.ofr2q.mongodb.net/Salazar-Torres-CS554-Lab3?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongodbConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to create and save sample data
async function createSampleData() {
  // Create a record company
  const recordCompany = new RecordCompany({
    name: "Sample Record Company",
    foundedYear: 1980,
    country: "USA",
  });
  await recordCompany.save();

  // Create an artist
  const artist = new Artist({
    name: "Sample Artist",
    dateFormed: new Date("1970-01-01"),
    members: ["Member 1", "Member 2"],
  });
  await artist.save();

  // Create an album
  const album = new Album({
    title: "Sample Album",
    releaseDate: new Date("1985-07-13"),
    genre: "Rock",
    artistId: artist._id,
    recordCompanyId: recordCompany._id,
    songs: ["Song 1", "Song 2", "Song 3"],
  });
  await album.save();

  console.log('Sample data created');
}

// Run the function to create sample data
createSampleData()
  .then(() => mongoose.disconnect())
  .catch(err => console.error('Failed to create sample data:', err));
