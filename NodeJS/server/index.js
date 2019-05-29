const http = require("http"),
  path = require("path"),
  Routing = require("./rutas.js"),
  express = require("express"),   
  cors = require('cors');
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

const PORT = 8082;
const app = express();
app.use(cors());

const Server = http.createServer(app);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/tienda");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/app", Routing);

Server.listen(PORT, function() {
  console.log("Server is listeng on port: " + PORT);
});
