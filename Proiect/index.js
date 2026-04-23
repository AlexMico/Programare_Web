const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));

// conectare MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/loginDB")
  .then(() => console.log("Conectat la MongoDB"))
  .catch(err => console.log(err));

// model utilizator
const User = mongoose.model("User", {
  username: String,
  password: String
});

// pagina login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// pagina register
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // criptare parola
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword
  });

  await newUser.save();

  res.send("Utilizator creat! <a href='/'>Login</a>");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    res.send("Login reușit! 🎉");
  } else {
    res.send("Date incorecte!");
  }
});

// server
app.listen(3000, () => {
  console.log("Server pornit pe http://localhost:3000");
});