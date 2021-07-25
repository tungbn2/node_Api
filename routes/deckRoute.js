const express = require('express')
const router = express.Router()

const DeckController = require('../controllers/deckController')

const {validatorBody, validatorParam, Schema} = require ('../helpers/routerHelpers')

router.route('/')
    .get(DeckController.getDecks)
    .post(validatorBody(Schema.newDeckSchema), DeckController.postDeck)
    .patch()
    .put()
    .delete()

router.route('/:deckID')
    .get(validatorParam(Schema.idSchema,'deckID'), DeckController.getDeckID)
    .put(validatorParam(Schema.idSchema,'deckID'), validatorBody(Schema.newDeckSchema), DeckController.putDeck)
    .patch(validatorParam(Schema.idSchema,'deckID'), validatorBody(Schema.updateDeckSchema), DeckController.patchDeck)
    .delete(validatorParam(Schema.idSchema,'deckID'), DeckController.deleteDeck)

 module.exports = router
