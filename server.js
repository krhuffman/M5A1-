const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const authenticationRoute = require('./routes/authenticationRoute');
app.use('/api', authenticationRoute);

app.use((err, erq, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://krnaranj:ift458@naranjo.xzkrvqi.mongodb.net/M5A1', {useNewUrlParser: true})
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const morgan = require('morgan-body');
var rfs = require('rotating-file-stream');
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log'), 
})

morgan(app,{
    stream: accessLogStream,
    noColors: true,
    logRequserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
});