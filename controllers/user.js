const express = require('express'); 
const jwt = require('jsonwebtoken');
const passport = require('passport');


// Create endpoint for /api/login for POST. Logging in a user
exports.loginUser = async (req, res, next) => {

  passport.authenticate('login', async (err, user, info) => {
    try {
      if(err || !user) {
        const error = new Error('An error occured')
        return next(error)
      }
      req.login(user, { session: false }, async (error) => {
        if(error) return next(error)

        const body = { _id: user._id, email: user.email }
        
        // Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body },'photostoragesecret')

        // Send back the token to the user
        return res.json({ token })
      })
    }
    catch (error){
      return next(error)
    }
  })(req, res, next)
}


