const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
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
    coin: {
        type: String,
        required: true
    }
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;