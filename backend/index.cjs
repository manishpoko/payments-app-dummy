const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const rootRouter = require('./routes/index.cjs') //immport the router


const app = express();

// Connect to MongoDB

app.use(cors());

app.use(express.json()); //parse JSON request bodies

app.use("/api/v1", rootRouter); //mount the router on /api/v1

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
