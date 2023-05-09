const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mysql2 = require('mysql2');

const db = mysql2.createConnection({
    'host': process.env.DATABASE_HOST,
    'port': process.env.DATABASE_PORT,
    'user': process.env.DATABASE_USER,
    'password': process.env.DATABASE_PASSWORD,
    'database': process.env.DATABASE_NAME
});

db.connect( (err) => {
    if(err){
        console.log(err);
        process.exit();
    }
    else{
        console.log("MY SQL Connected..")
    }
});

module.exports = db;