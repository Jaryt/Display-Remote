const express = require('express');
const cors = require('cors');
const monk = require('monk');
const multer = require('multer');
const fs = require('fs');
const { time } = require('console');
const app = express();
const db = monk('localhost:27017')
const media = `${__dirname}/assets/media`

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, media)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase())
  }
});

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

const fixedDuration = 1000;

const play = () => {
  playback.index = (++playback.index) % playback.count;

  timeout.current = setTimeout(play, fixedDuration);
  timeout.remaining = fixedDuration;
  timeout.lastUpdate = Date.now();
}

const playback = {
  playing: true,
  index: 0,
  count: 0
};

const timeout = {
  current: undefined,
  lastUpdate: Date.now(),
}

app.get("/toggle", (req, res) => {
  if (playback.playing && timeout.current != undefined) {
    clearTimeout(timeout.current);

    let now = Date.now();

    timeout.remaining -= (now - timeout.lastUpdate);
    timeout.lastUpdate = now;
  } else {
    timeout.current = setTimeout(play, timeout.remaining);
  }

  playback.playing = !playback.playing;

  res.json(playback);
  res.status(200);
})

app.get("/playback", (req, res) => {
  res.json(playback);
  res.status(200);
})

app.post("/seek", (req, res) => {
  playback.index = (playback.index + req.body.offset) % playback.count;

  if (playback.index < 0) {
    playback.index = playback.count - 1;
  }

  if (timeout.current) {
    clearTimeout(timeout.current);
  }

  playback.remaining = fixedDuration;

  if (playback.playing) {
    timeout.current = setTimeout(play, fixedDuration);
  }

  res.json(playback);
  res.status(200);
})

const getMedia = () => {
  const files = fs.readdirSync(media);

  return files;
}

const setSequence = (res) => {
  if (res.sequence) {
    playback.index = 0;
    playback.count = res.sequence.length;
  }
}

app.get('/available', (req, res) => {
  res.json(getMedia());
});

app.post('/upload', upload.array('files', 12), (req, res) => {
  res.status(200);
  res.json(getMedia());
})

const sequences = db.get('sequence');

app.get('/sequence', (req, res) => {
  sequences.find().then(sequence => {
    if (sequence) {
      res.json(sequence[0]);
      res.status(200);
    }
  });
});

app.post('/sequence', (req, res) => {
  sequences.drop();
  sequences.insert(req.body).then(newSequence => {
    setSequence(newSequence);

    res.json(newSequence.sequence);
    res.status(200);
  }).catch(e => console.log(e));
});

app.listen(5000, () => {
  sequences.find().then(sequence => {
    setSequence(sequence ? sequence[0] : { sequence: [] })
  })
    .catch(e => console.log(e));

  play();

  console.log('Server started')
})