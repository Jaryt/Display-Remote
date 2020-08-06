const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');

const app = express();
const storePath = __dirname + '/store/';
const mediaPath = storePath + 'media/';
const exec = require('child_process').exec;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaPath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase().replace(' ', '_'))
  }
});

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(mediaPath))
app.use(express.json());
app.use(cors());

const fixedDuration = 5000;

const play = () => {
  let now = Date.now();

  if (playback.playing) {
    let deltaTime = now - state.lastUpdate;

    playback.time += deltaTime;

    if (playback.time > playback.duration) {
      playback.index = (++playback.index) % playback.count;
      playback.time = 0;
    }

    let cur = state.sequence[playback.index];

    if (cur) {
      playback.duration = cur.duration;
    }
  }

  setTimeout(play, 1000);
  state.lastUpdate = now;
}

const playback = {
  playing: true,
  refresh: false,
  index: 0,
  count: 0,
  duration: 0,
  time: 0,
  id: 0,
};

const state = {
  sequence: [],
  lastUpdate: Date.now(),
}

app.get("/toggle", (req, res) => {
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

  res.json(playback);
  res.status(200);
})

const getMedia = () => {
  const files = fs.readdirSync(mediaPath);

  return Promise.all(files.map(media =>
    formatMedia(media)
  ));
}

const setSequence = (res) => {
  if (res.sequence) {
    playback.index = 0;
    playback.count = res.sequence.length;
    playback.id++;

    let cur = state.sequence[playback.index];

    if (cur) {
      playback.duration = cur.duration;
    }

    state.sequence = res.sequence;
  }
}

const formatMedia = media => {
  let type = mime.getType(media);

  return new Promise((resolve) => {
    if (type.startsWith('video')) {
      exec(`ffmpeg -i ${mediaPath}${media} 2>&1`, (err, dur) => {
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

app.post('/remove', (req, res) => {
  fs.unlink(`${mediaPath}${req.body.media}`, (err) => {
    res.status(200);
  });
});

app.get('/sequence', (req, res) => {
  res.json({ sequence: state.sequence });
  res.status(200);
});

app.post('/sequence', (req, res) => {
  const data = JSON.stringify(req.body);

  setSequence(req.body);

  fs.writeFile(storePath + 'sequence.json', data, () => {
    res.json(req.body.sequence);
    res.status(200);
    console.log(`Sequence has been written to is ${storePath}sequence.json`);
  });
});

app.listen(5000, () => {
  try {
    fs.readFile(storePath + 'sequence.json', 'utf-8', (err, data) => {
      if (!err) {
        const sequence = JSON.parse(data.toString());

        setSequence(sequence ? sequence : { sequence: [] })
        play();
      }
    });
  } catch (err) {
    setSequence({ sequence: [] })
  }

  console.log('Server started. Version 1.1.0')
})