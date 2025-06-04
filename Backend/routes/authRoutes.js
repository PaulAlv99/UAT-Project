const express = require('express');
const router = express.Router();
const passport = require('../middleware/passport');

const { register, login, recoverPassword, resetPassword} = require('../controllers/authController');


//auth
router.post('/register', register);
router.post('/login', login);

router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
