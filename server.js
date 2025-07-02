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

// const authRouter = require("./contro")//didn't complete this, not keeping up cause not typing fast enough.



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
}); //! This is where I left off with this lecture/lab -- start here when come back & review entire lecture as well.



// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); // so we can use query strings and req.body
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method")); // method override so I can do PUT and DELETE requests
// Morgan for logging HTTP requests
app.use(morgan('dev')); // morgan for logging

// ROUTES

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
