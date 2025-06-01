const express = require('express');
const router = express.Router();
const passport = require('../middleware/passport');
const {getMe, updateProfile, listUsers,getMessagesWithUser} = require('../controllers/userController');

router.get("/me", passport.authenticate("jwt", { session: false }), getMe);
router.patch('/update-profile', passport.authenticate("jwt", { session: false }), updateProfile);
router.get("/all",passport.authenticate("jwt", { session: false }), listUsers);
router.get("/messages/:userId", passport.authenticate("jwt", { session: false }), getMessagesWithUser);
module.exports = router;
