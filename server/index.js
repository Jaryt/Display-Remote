const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');

const app = express();
const mediaPath = __dirname + '/media/';
const exec = require('child_process').exec;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaPath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase())
  }
});

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(mediaPath))
app.use(express.json());
app.use(cors());

const fixedDuration = 10000;

const play = () => {
  playback.index = (++playback.index) % playback.count;

  let cur = state.sequence[playback.index];

  if (cur) {
    timeout.remaining = cur.duration;
  }

  timeout.current = setTimeout(play, timeout.remaining);
  timeout.lastUpdate = Date.now();
}

const playback = {
  playing: true,
  index: 0,
  count: 0,
  id: 0,
};

const state = {
  sequence: []
}

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
    timeout.current = setTimeout(play, playback.remaining);
  }

  res.json(playback);
  res.status(200);
})

const getMedia = () => {
  console.log('Reading from ' + mediaPath)

  const files = fs.readdirSync(mediaPath);

  return Promise.all(files.map(media =>
    formatMedia(media)
  ));
}

const setSequence = (res) => {
  console.log(res);

  if (res.sequence) {
    playback.index = 0;
    playback.count = res.sequence.length;
    playback.id = res._id;
    state.sequence = res.sequence;
  }
}

const formatMedia = media => {
  let type = mime.getType(media);

  return new Promise((resolve) => {
    if (type.startsWith('video')) {
      exec(`ffmpeg -i ${mediaPath}${media} 2>&1 | grep Duration | awk '{print $2}' | tr -d , | sed s/://g`, (err, dur) => {
console.log(dur + " durr");

        resolve({
          path: media,
          type,
          duration: dur * 1000
        });
      });
    } else {
      resolve({
        path: media,
        type,
        duration: fixedDuration
      });
    }
  });
}

app.get('/available', (req, res) => {
  getMedia().then((formattedMedia) => {
    console.log(formattedMedia)
    res.json({
      id: playback.id,
      media: formattedMedia
    });
  });
})

app.post('/upload', upload.array('files', 12), (req, res) => {
  getMedia().then((formattedMedia) => {
    res.status(200);
    res.json(formattedMedia);
  });
})

app.get('/sequence', (req, res) => {
  res.json({ sequence: state.sequence });
  res.status(200);
});

app.post('/sequence', (req, res) => {
  const data = JSON.stringify(req.body);

  setSequence(req.body);

  console.log(data);

  fs.writeFile(__dirname + '/sequence.json', data, () => {
    res.json(req.body.sequence);
    res.status(200);
    console.log("JSON data is saved.");
  });
});

app.listen(5000, () => {
  fs.readFile(__dirname + '/sequence.json', 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }

    const sequence = JSON.parse(data.toString());

    setSequence(sequence ? sequence  : { sequence: [] })
    play();
  });

  console.log('Server started')
})