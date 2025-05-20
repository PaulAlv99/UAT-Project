const express = require('express');
const router = express.Router();
const passport = require('../middleware/passport');
const {getMe} = require('../controllers/userController');

router.get("/me", passport.authenticate("jwt", { session: false }), getMe);

module.exports = router;
