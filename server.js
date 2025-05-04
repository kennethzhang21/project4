const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
