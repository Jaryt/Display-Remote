const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object({
    title: Joi.string().alphanum().required(),
    sequence: [
        {
            
        }
    ],
    audio: [

    ]
});

const displays = db.get('displays');

function getAll() {
    return displays.find();
}

function create(display) {
    if (!displays.username) displays.username = 'Anonymous';

    const result = Joi.validate(displays, schema);
    if (result.error == null) {
        display.created = new Date();
        return displays.insert(display);
    } else {
        return Promise.reject(result.error);
    }
}

module.exports = {
    create,
    getAll
};