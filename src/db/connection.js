const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'localhost/displayRemote';
const db = monk(connectionString);
 
module.exports = db;