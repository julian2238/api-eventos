const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// app.use(require('./routes/index'));

app.use("/api/v1/auth", require("./routes/auth"));

app.use("/api/v1/eventos", require("./routes/eventos"));

app.listen(4000);

console.log("Server running on port 4000");
