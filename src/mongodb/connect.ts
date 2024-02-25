import { connect } from 'mongoose';

const uri = ""


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