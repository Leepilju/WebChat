var mongoose = require('mongoose');
var host = 'mongodb://localhost:27017/test';

// 몽고디비 mongoose Connection
var db = mongoose.connect(host, {
    poolSize: 5 // defult: 5
}, (err) => {
    if (err) {
        console.log(`Error connecting to ${host}`);
        console.log(`Reason: ${err}`);
    } else {
        console.log(`Succeeded in connecting to ${host}`);
    }
});
