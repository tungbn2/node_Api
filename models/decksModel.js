const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deckSchema = new Schema ({
    name: {
        type: String
    },
    description: {
        type: String
    },
    total: {
        type: Number,
        default: 0
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

const Deck = mongoose.model('Deck', deckSchema)

module.exports = Deck