import { connect } from 'mongoose';

const uri = "mongodb://localhost:27017/Salazar-Torres-CS554-Lab3"


async function connectMongo() {
   try {
    await connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export {
    connectMongo
}