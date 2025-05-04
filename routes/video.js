const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const VIDEOS_FILE = path.join(__dirname, '../data/videos.json');

function readVideos() {
  return JSON.parse(fs.readFileSync(VIDEOS_FILE, 'utf8'));
}

function writeVideos(videos) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
}

router.get('/new_video', (req, res) => {
  if (!req.session.user) return res.render('login', { error: 'You must login to access this content' });
  res.render('new_video', { error: null });
});

router.post('/new', (req, res) => {
  if (!req.session.user) return res.render('login', { error: 'You must login to access this content' });
  const { title, url } = req.body;
  if (!title || !url) {
    return res.render('new_video', { error: 'Title and URL are required.' });
  }
  const videos = readVideos();
  videos.push({ title, url, uploader: req.session.user.email });
  writeVideos(videos);
  res.render('new_video', { error: null, message: 'Video added successfully!' });
});

router.get('/dashboard/:videofilter', (req, res) => {
  if (!req.session.user) return res.render('login', { error: 'You must login to access this content' });
  const videos = readVideos();
  const filter = req.params.videofilter;
  const filteredVideos = filter === 'mine'
    ? videos.filter(v => v.uploader === req.session.user.email)
    : videos;
  res.render('dashboard', { videos: filteredVideos, user: req.session.user });
});

module.exports = router;
