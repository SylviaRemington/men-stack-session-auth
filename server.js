// Name of file: men-stack-session-auth
// Lecture code-along with notes about authorization
// Lesson at: MEN Stack Session Auth in General Assembly - Modules - Unit 2 - June 12th, 2025

const dotenv = require("dotenv"); //DOTENV
dotenv.config();
const express = require("express"); //EXPRESS
const app = express();
const mongoose = require("mongoose"); //MONGOOSE
const methodOverride = require("method-override"); //METHOD-OVERRIDE
const morgan = require("morgan"); //MORGAN
const session = require('express-session'); //express-session

//auth router holds all the authorization endpoints
const authController = require("./controllers/auth.js");



// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000"; //ternery statement

/*
process.env.what ?
You probably noticed a new port variable we’re defining and using in the app.listen statement. This will come in handy when we’re deploying our applications and cannot know in advance which port the hosting service will use.
The syntax commonly used to set this variable is a ternary statement, which is essentially a condensed if...else statement. You could replace it with the following:

let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3000;
}
*/


// Connecting Mongoose to MongoDB Database
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
}); 



// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); // so we can use query strings and req.body

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method")); // method override so I can do PUT and DELETE requests

// Morgan for logging HTTP requests
app.use(morgan('dev')); // morgan for logging

//Express-Session Module in the middleware
//Need to check authentication before we go into any controllers - so putting above controllers
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth", authController); //invoke auth here

// ROUTES

// GET /
app.get('/', async (req, res) => {
    // res.send('Hello, friend! This will be our homepage once it has been set up!');
    res.render('index.ejs', {
      //modifying the landing page & index route by adding a user object
      user: req.session.user,
    }); 
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
