const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    coin: {
        type: String,
        required: true
    }
})

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;