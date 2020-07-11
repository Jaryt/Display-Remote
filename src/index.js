const express = require('express');
const cors = require('cors');
const monk = require('monk');
const multer = require('multer');
const fs = require('fs');

const app = express();
const db = monk('localhost:27017')
const media = `${__dirname}/assets/media`

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, media)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

const playback = {
  playing: true,
  index: 0,
};

app.get("/playback", (req, res) => {
  res.json(playback);
})

const getMedia = () => {
  const files = fs.readdirSync(media);

  return files;
}

app.get('/available', (req, res) => {
  res.json(JSON.stringify(getMedia()));
});


app.post('/upload', upload.array('files', 12), (req, res) => {
  res.status(200);
  res.json(JSON.stringify(getMedia()));
})

const sequences = db.get('sequence');

app.get('/sequence', (req, res) => {
  sequences.find().then((sequence) => {
    res.json(sequence);
    res.status(200);
  });
});

app.post('/sequence', (req, res) => {
  sequences.insert(req.body).then(sequence => {
    res.json(sequence);
    res.status(200);
  })
});

app.listen(5000, () => {
  console.log('Starting server...');
})