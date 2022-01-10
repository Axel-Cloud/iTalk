import mongoose from "mongoose";

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://iTalkAdmin:26ax02st@italk1.ic8sx.mongodb.net/iTalk1?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', () => {
    console.log("Error on connection");
});

db.once('open', () => {   
    console.log("Connected")
});