const { exec } = require('child_process');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const pageroutes = require('./routes/pages.js');
const authroutes = require('./routes/auth.js');
const jwt = require('jsonwebtoken');
const app = express();

dotenv.config({ path: './.env' });

exec('node db.js', (err, stdout, stderr) => {
    if(err){
        console.log(err);
        return;
    }
    if(stderr){
        console.log(stdout);
        return;
    }
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

app.use('/', pageroutes);
app.use('/auth', authroutes);

app.listen(3000);