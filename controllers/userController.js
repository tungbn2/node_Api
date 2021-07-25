const User = require ('../models/usersModel')
const Deck = require ('../models/decksModel')
const JWT = require('jsonwebtoken')

const {JWT_SECRET} = require ('../configs/index')

const encodeToken = (userID) => {
  return JWT.sign({
    iss: 'tungbn', // issue author - issuer
    sub: userID, //subject
    iat: new Date().getTime(), // issue at time
  }, JWT_SECRET)
}

const Joi = require('joi')
const idSchema = Joi.object().keys({
    userID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
})

const get = async (req, res, next) => {
    //callback
    // User.find({}, (err, data) => {
    //     if (err) next(err)
    //     return res.status(200).json({data})
    // }) 

    //promise
    // User.find({})
    //     .then((users) => res.status(200).json({users}) )
    //     .catch((err) => next(err))

    //async/await
    try {
        const users = await User.find({})
        return res.status(200).json({users})
    } catch (err) {next(err)}
}

const getUser = async (req, res, next) => {
    const { userID } = req.value.params
    try{
        const user = await User.findById(userID)
        return res.status(200).json({user})
    }catch (err) {next(err)}
}

const getUserDecks = async (req, res, next) => {
    const {userID} = req.value.params
    // get user
    const user = await User.findById(userID).populate('decks')
    res.status(200).json(user)
}

const replaceUser = async (req, res, next) => {
    // thay thế toàn bộ thông tin
    const { userID } = req.value.params
    const newUser = req.value.body
    try{
        const result = await User.findByIdAndUpdate(userID, newUser)
        return res.status(200).json({success: true})
    }catch (err) {next(err)}
}

const signIn = async (req, res, next) => {
    try{
      const token = encodeToken (req.user._id)
      res.setHeader('Authorization', token)
      return res.status(200).json(req.user)
    }catch (err) {next(err)}
}

const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password} = req.value.body
    try{
      //check if have user
      const foundUser = await User.findOne({email})
      console.log (foundUser)
      if (foundUser) return res.status(403).json({error: {message: "email is used"}})
        // create a newUser
        const newUser = new User ({ firstName, lastName, email, password})
        newUser.save()
        //encode a token
        const token = encodeToken (newUser._id)
        
        res.setHeader('Authorization', token)
        return res.status(201).json({"success": true, token})
    }catch (err) {next(err)}
}

const secret = async (req, res, next) => {
    
    try{
      return res.status(200).json({ resource: true} )
    }catch (err) {next(err)}
}


const updateUser = async (req, res, next) => {
    // cập nhật theo trường
    const { userID } = req.value.params
    const newUser = req.value.body
    console.log(newUser)
    try{
        const result = await User.findByIdAndUpdate(userID, newUser)
        return res.status(200).json({success: true})
    }catch (err) {next(err)}
}

const post = async (req, res, next) => {
    //create object model
    const newUser = new User(req.value.body)

    //callback save
    // newUser.save((err, data) => {
    //     if (err) next(err)
    //     return res.status(201).json({data})
    // })

    //promise
    // newUser.save()
    //     .then(data => res.status(201).json({data}))
    //     .catch((err) => next(err))

    //await
    try {
        await newUser.save()
        return res.status(201).json({newUser})
    } catch (err) {next(err)}
}

const postUserDeck = async (req, res, next) => {
    const {userID} = req.value.params
    
    try {
        //create new deck 
        const newDeck = new Deck (req.value.body)

        //get user
        const user = await User.findById(userID)

        //assign user
        newDeck.owner = user._id

        //save deck
        await newDeck.save()

        //add deck to user's decks
        user.decks.push(newDeck._id)

        //save the user
        await user.save()

        res.status(201).json({newDeck})
    
    } catch (err) {next(err)}

}


module.exports = {
    get,
    post,
    getUser,
    updateUser,
    replaceUser,
    getUserDecks,
    postUserDeck,
    signIn,
    signUp,
    secret
}