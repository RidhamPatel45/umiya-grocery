const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, loginId, password } = req.body;

  const existingUser = await User.findOne({ loginId });
  if (existingUser) return res.status(400).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, loginId, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully!" });
});

// Login
app.post('/api/login', async (req, res) => {
  const { loginId, password } = req.body;

  const user = await User.findOne({ loginId });
  if (!user) return res.status(400).json({ message: "User not found." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

  res.json({ message: `Welcome ${user.name}!` });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
