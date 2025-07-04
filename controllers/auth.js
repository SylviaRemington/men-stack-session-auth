const express = require('express');
const router = express.Router(); 
//Router creates an object where we can define all of our end points & get methods.
//Will be moving a lot of the app.gets into the Router and out of the server.js
//Router is a piece of middleware.

const bcrypt = require('bcrypt');
const User = require("../models/user.js"); //import our models

// SIGN-UP ROUTE
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
// localhost:3000/auth/sign-up

//First Version
// router.post("/sign-up", (req, res) => {
//     res.send("submitted the form to create a new user");
// });

// More decked out version
router.post("/sign-up", async (req, res) => {
    //Enforcing unique usernames
    const userInDatabase = await User.findOne({username: req.body.username});

    // looking for if user is unique
    if (userInDatabase) {
        return res.send("Username already taken.");
    }

    // looking for if passwords do not match
    if (req.body.password !== req.body.confirmPassword) {
        res.send("Passwords do not match.");
    }

    // bcrypt - adding level of encryption with salting of 10
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // return res.send(hashedPassword);

    // Validation logic
    // Create a user if they:
    // Have a unique username &
    // Supplied matching password & password confirmation
    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}!`);

});

// SIGN-IN ROUTE
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});
// localhost:3000/auth/sign-in

router.post("/sign-in", async (req, res) => {
    // res.send("User is trying to sign in."); // tested to make sure it functions
    
    // Now need to create the logic to make sure user exists
    // We have to get the user before we check that password.

    // FIRST GET THE USER FROM THE DATABASE
    const userInDatabase = await User.findOne({username: req.body.username});

    // if no user in database
    if (!userInDatabase) {
        return res.send('Login failed. Please try again.');
    }

    // WHEN THERE IS A USER: TIME TO TEST THEIR PASSWORD WITH BCRYPT
    const validPassword = bcrypt.compareSync(
        req.body.password, //the password the user put in
        userInDatabase.password //the encrypted version of that password
    ); //Salting is how difficult it should be to decryp password: level 1 or 2 or 10?
    
    if (!validPassword) {
        return res.send('Login failed. Please try again.');
    }

    // When there is a user AND they had the correct password: Time to make a session!
    // Avoid storing the password, even in hashed format, in the session.
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };

    // res.send('Welcome to the Kind Up Movement! We are so happy you are here, creating change on the planet!');
    
    res.redirect('/');

});

// CREATING A SIGN-OUT ROUTE - defining the sign-out route
// MAKING SURE ROUTE WORKS FIRST - below
// router.get('/sign-out', (req, res) => {
//     res.send('Sign-Out Page');
// });
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = router; //exporting router from here