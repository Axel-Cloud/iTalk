import mongoose from "mongoose";

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/iTalk", {
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