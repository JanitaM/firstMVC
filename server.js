// Import libraries
const
  express = require("express"),
  // It’s a web framework that let’s you structure a web application to handle multiple different http requests at a specific url.
  mongoose = require("mongoose"),
  // makes mongo easier
  bodyParser = require("body-parser"), // 
  path = require("path");  // 

const
  app = express(),
  PORT = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://janitam:hello@cluster0-n7fy6.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Model
const UserModel = mongoose.model("user", userSchema);

// API
// Post Request
app.post("/user", async (request, response) => {
  try {
    console.log("POST USER"); // confirm it's working, prints in terminal
    let userInstance = new UserModel(request.body);
    console.log(userInstance);  //confirm it's working
    const created = await UserModel.create(userInstance);
    response.send(created);
  }
  catch (error) {
    response.status(500).send(error);
  }
});

// Get Request
app.get("/user", async (request, response) => {
  try {
    console.log("GET USER");
    let userInstance = await UserModel.find({ username: "coolgirl" });
    console.log(userInstance);
    response.send(userInstance);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Put Request
app.put("/user", async (request, response) => {
  try {
    console.log("PUT USER");
    // let userInstance = await UserModel.findOneAndUpdate({ username: request.params.username }, request.body);
    let userInstance = await UserModel.findOneAndUpdate(request.query, request.body);
    console.log(userInstance);
    response.send(userInstance);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Delete Request
app.delete("/user/:username", async (request, response) => {
  try {
    console.log("DELETE USER");
    let userInstance = await UserModel.findOneAndDelete({ username: request.params.username });
    console.log(userInstance);
    response.send(userInstance);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Get multiple users
app.get("/users", async (request, response) => {
  try {
    console.log("GET USERS");
    let userInstance = await UserModel.find({});
    let usersMap = {}
    userInstance.map(user => {
      usersMap[user.id] = user
    });
    console.log(usersMap);
    response.send(usersMap);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Get request to index.html
app.get("/", async (request, response) => {
  try {
    console.log("SEND HTML HOME PAGE");
    response.sendFile(path.join(__dirname + "/index.html"));
  } catch (error) {
    response.status(500).send(error);
  }
});


const start = () => {
  return app.listen(PORT, () => console.log(`server is running on ${PORT}`));
}

module.exports = { start }