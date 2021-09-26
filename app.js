const express = require("express");
const fileupload = require("express-fileupload")
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors')
require("./db/conn");
app.use(express.json());
app.use(cors())
app.use(fileupload())

app.use(require("./route/user"));
app.use(require("./route/file"));

app.get("/", (req, res) => {
  res.send("hi harsh");
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
