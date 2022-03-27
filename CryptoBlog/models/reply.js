const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    replyTo: {
        type: Number,
        required: true
    }
})

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;