const mongoose = require('mongoose');
const host = require('../config/config').databaseHost;
// 몽고디비 mongoose Connection
const db = mongoose.connect(host, {
    poolSize: 5 // defult: 5
}, (err) => {
    if (err) {
        console.log(`Error connecting to ${host}`);
        console.log(`Reason: ${err}`);
    } else {
        console.log(`Succeeded in connecting to ${host}`);
    }
});
