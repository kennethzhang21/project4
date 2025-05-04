const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }
  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.render('register', { error: 'Email already registered.' });
  }
  users.push({ email, name, password });
  writeUsers(users);
  res.render('account_created');
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.render('login', { error: 'Incorrect Password' });
  }
  req.session.user = { email: user.email, name: user.name };
  res.redirect('/video/dashboard/all');
});

module.exports = router;
