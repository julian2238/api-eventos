const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", require("./routes"));

app.listen(8000);

console.log("Server running on port 8000");
