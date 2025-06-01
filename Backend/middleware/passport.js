const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User = require('../models/userModel');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select('-password');

    if (user){
    console.log("user auth by passport");
    return done(null, user);
    }
    console.log("user not auth by passport");
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
