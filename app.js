const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieparser = require("cookie-parser");



//const path = require("path");

//to solve the about-login error we have to add cookie parser in app.js
app.use(cookieparser());


 
dotenv.config({ path: './config.env' });
 require('./db/conn');
const User = require('./model/schema');


//to covert the data in jSON so our device will under stand
app.use(express.json());

//We link the router files to make our route easy
//app.use(require('./router/auth'));
app.use(require('./router/auth'));

 const PORT = process.env.PORT || 5000;




// MiddleWare

// const middleware = (req,res, next) => {
//     console.log(`hello my middleware`);
//     next();
//    }    

// app.get('/', (req, res) => {
//    res.send(`hello world  from the server from app.js`);
// });


// app.get('/about', middleware, (req, res) => {
//     res.send(`hello  about world  from the server`);
//  });


//  app.get('/contact', (req, res) => {
//     res.send(`hello contact  world  from the server`);
//  });
//  app.get('/signin', (req, res) => {
//     res.send(`hello login  world  from the server`);
//  });
//  app.get('/signup', (req, res) => {
//     res.send(`hello Registeration  world  from the server`);
//  });


if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

 
app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
});



