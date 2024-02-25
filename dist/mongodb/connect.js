import { connect } from 'mongoose';
const uri = "mongodb+srv://marcos:pVFDWJ891cRDz53g@cluster0.ofr2q.mongodb.net/Salazar-Torres-CS554-Lab3?retryWrites=true&w=majority&appName=Cluster0";
async function connectMongo() {
    try {
        await connect(uri);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
export { connectMongo };
