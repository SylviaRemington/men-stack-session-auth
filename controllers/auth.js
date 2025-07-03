const express = require('express');
const router = express.Router(); 
//Router creates an object where we can define all of our end points & get methods.
//Will be moving a lot of the app.gets into the Router and out of the server.js
//Router is a piece of middleware.

const bcrypt = require('bcrypt');
const User = require("../models/user.js"); //import our models

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

module.exports = router; //exporting router from here