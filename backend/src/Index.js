import express from "express";
import Cors from "cors";
import "./Database/db";

require('dotenv').config();

const App = express();

/* Server Settings */
process.setMaxListeners(0)
App.set("Port", process.env.Port || 3003);

/* Middlewares */
App.use(Cors());
App.use(express.json());

/* Server Routes */
App.use("/api/Users", require("./Routes/Users"));


/* Server Listen */
App.listen(App.get("Port"), () => {
    console.log(`Listen on port ${App.get("Port")}`);
});