const Passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require ('passport-local').Strategy
const {ExtractJwt} = require('passport-jwt')
const {JWT_SECRET} = require ('../configs/index')

const User = require ('../models/usersModel')

Passport.use( new JwtStrategy ({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
  secretOrKey: JWT_SECRET,
}, async (payload, done) => {
  try{
    //check user
    const user = await User.findById(payload.sub)

    if (!user) return done (null, false)

    done(null, user)
  } catch (error) {
    done( error, false)
  }
}))

//passport local
Passport.use (new LocalStrategy ({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const userInfo = await User.findOne({email})

    if (!userInfo) return done(null, false)

    // decoded and compare password
    const isCorrectPassword = await userInfo.isValidPassword(password)

    if (!isCorrectPassword) return done(null, false)

    done (null, userInfo)

  } catch (error) {
    done( error, false)
  }
}))