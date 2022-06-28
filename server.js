require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortId = require('shortid')
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const mongoUrl = ``;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

const URL = mongoose.model('URL', urlSchema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = {

};

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url ? req.body.url : '';
  let valid = urlRegex.test(url);
  if(!valid) return res.json({error: 'invalid url'});
  else {
    let short_url = shortId.generate();
    urls[short_url] = url;
    console.log(urls);
    return res.json({
    original_url: url,
    short_url
  });
  }
});

app.get('/api/shorturl/:shorturl?', (req, res) => {
  let url = req.params.shorturl;
  let original = urls[url];
  console.log('GET url',original);
  if(!original) return res.json('url not found');
  if(original) return res.redirect(original);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
