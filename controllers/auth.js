const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../models/user')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
  }, async (email, password, done) => {
      try {
        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        //Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        done(error);
      }
  }));


// Create a passport middleware to handle user login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find the user associated with the provided email
        const user = await UserModel.findOne({ email })
        if(!user){
            // If user not found in db, return error message
            return done(null, false, {message: 'Username or password is incorrect'})
        }

        // Validate password to see if it matches with the hashed password in the db
        const validate = await user.isValidPassword(password)
        if (!validate) {
            return done(null, false, {message: 'Password is incorrect'})
        }
        
        // Send the user information to the next middleware
        return done(null, user, {message: 'Logged in successfully!'})
    }
        catch (error) {
            return done(error)
    }
}))

//This verifies that the token sent by the user is valid

var opts = {}
//secret we used to sign our JWT
opts.secretOrKey = 'photostoragesecret'
//we expect the user to send the token as a query paramater with the name 'secret_token'
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload.user.email)
    // UserModel.findOne({id: jwt_payload.id}, function(err, user) {
        if (!jwt_payload) {
            return done('Error occured. No user found', false);
        }
        if (jwt_payload) {
            return done(null, jwt_payload.user.email);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    // });
}));

