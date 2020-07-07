const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
})

app.get('/messages', (req, res) => {
    // messages.getAll().then((messages) => {
    //     res.json(messages);
    // });
});

app.post('/messages', (req, res) => {
    // console.log(req.body);
    // messages.create(req.body).then((message) => {
    //     res.json(message);
    // }).catch((error) => {
    //     res.status(500);
    //     res.json(error);
    // });
});

app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})