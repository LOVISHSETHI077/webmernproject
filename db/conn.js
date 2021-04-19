const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewurlParser: true,
    useCreateIndex: true,
    useUnifiedtopology: true,
    usefindAndModify: false
 }).then(() => {
    console.log(`Connection successful`);
 }).catch((err) => console.log(`not connected`));