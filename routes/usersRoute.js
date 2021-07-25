const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')

const {validatorBody, validatorParam, Schema} = require ('../helpers/routerHelpers')

const passport = require ('passport')
const passportConfig = require ('../middleware/passport')

router.route('/')
    .get(UserController.get)
    .post(validatorBody(Schema.userSchema), UserController.post)

router.route('/signup').post(validatorBody(Schema.authSignUpSchema), UserController.signUp)

router.route('/signin').post(validatorBody(Schema.authSignInSchema), passport.authenticate('local', { session: false }), UserController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/:userID')
    .get(validatorParam(Schema.idSchema,'userID'), UserController.getUser)
    .put(validatorParam(Schema.idSchema,'userID'), validatorBody(Schema.userSchema), UserController.replaceUser)
    .patch(validatorParam(Schema.idSchema,'userID'), validatorBody(Schema.userUpdateSchema),UserController.updateUser)

 router.route('/:userID/decks')
    .get(validatorParam(Schema.idSchema,'userID'), UserController.getUserDecks)
    .post(validatorParam(Schema.idSchema,'userID'), validatorBody(Schema.deckSchema), UserController.postUserDeck)

 module.exports = router
