const express = require('express');
const cors = require('cors');
const monk = require('monk');
const multer = require('multer');
const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration')
const mime = require('mime');

const app = express();
const db = monk('localhost:27017')
const mediaPath = `${__dirname}/../public/media/`

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // if (mime.getType(file.originalname.toLowerCase()).startsWith('video')) {
    //   cb(null, mediaPath)
    // } else {
    cb(null, mediaPath)
    // }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase())
  }
});

const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

const fixedDuration = 2000;

const play = () => {
  playback.index = (++playback.index) % playback.count;

  timeout.remaining = timeout.sequence[playback.index].duration;
  timeout.current = setTimeout(play, timeout.remaining);
  timeout.lastUpdate = Date.now();
}

const playback = {
  playing: true,
  index: 0,
  count: 0,
  id: 0,
};

const timeout = {
  sequence: undefined,
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

  // if ()

  if (playback.playing) {
    timeout.current = setTimeout(play, playback.remaining);
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
    playback.id = res._id;
    timeout.sequence = res.sequence;
  }
}

const formatMedia = media => {
  let type = mime.getType(media);

  return new Promise((resolve) => {
    if (type.startsWith('video')) {
      getVideoDurationInSeconds(mediaPath + media).then(dur => {
        resolve({
          path: media,
          type,
          duration: dur * 1000
        });
      }).catch(e => console.log(e));
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

const sequences = db.get('sequence');

app.get('/sequence', (req, res) => {
  sequences.find().then(sequence => {
    if (sequence) {
      sequence.forEach(element => {
        console.log(element);
      });

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
  sequences.findOne({}).then(sequence => {
    setSequence(sequence ? sequence : { sequence: [] })
    play();
  })
    .catch(e => console.log(e));


  console.log('Server started')
})