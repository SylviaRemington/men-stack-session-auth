const express = require('express');
const router = express.Router(); 
//Router creates an object where we can define all of our end points & get methods.
//Will be moving a lot of the app.gets into the Router and out of the server.js
//Router is a piece of middleware.

router.get("/sign-up", (req, res) => {
    res.send('sign up route');
//   res.render("auth/sign-up.ejs");
});

module.exports = router; //exporting router from here