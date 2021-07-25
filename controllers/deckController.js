const User = require ('../models/usersModel')
const Deck = require ('../models/decksModel')



const getDecks = async (req, res, next) => {
    try {
        const decks = await Deck.find({})
        return res.status(200).json({decks})
    } catch (err) {next(err)}
}

const getDeckID = async (req, res, next) => {
    try {
        const deckID = req.value.params.deckID
        const deck = await Deck.findById(deckID)
        return res.status(200).json({deck})
    } catch (err) {next(err)}
}

const deleteDeck = async (req, res, next) => {
    try {
        const {deckID} = req.value.params
        //get a desk
        const deck = await Deck.findById(deckID)
        const ownerID = deck.owner

        //get owner
        const owner = await User.findById(ownerID)

        //remove deck
        await deck.remove()

        //remove decks list
        owner.decks.pull (deck)
        await owner.save()

        return res.status(200).json({deck})
    } catch (err) {next(err)}
}

const postDeck = async (req, res, next) => {
    try {
        //find owner
        const owner = await User.findById(req.value.body.owner)

        //create deck
        const deck = req.value.body
        delete deck.owner

        deck.owner = owner._id
        const newDeck = new Deck(deck)
        await newDeck.save()

        //add deck to user
        owner.decks.push(newDeck._id)
        await owner.save()

        return res.status(200).json({newDeck})
    } catch (err) {next(err)}
}

const putDeck = async (req, res, next) => {
    try {
        const deckID = req.value.params.deckID
        const newDeck =req.value.body
        const deck = await Deck.findByIdAndUpdate(deckID, newDeck)
        return res.status(200).json({deck})
    } catch (err) {next(err)}
}

const patchDeck = async (req, res, next) => {
    try {
        const deckID = req.value.params.deckID
        const newDeck =req.value.body
        const deck = await Deck.findByIdAndUpdate(deckID, newDeck)
        return res.status(200).json({deck})
    } catch (err) {next(err)}
}





module.exports = {
    getDecks,
    getDeckID,
    deleteDeck,
    postDeck,
    putDeck,
    patchDeck
}