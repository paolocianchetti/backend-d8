const mongoose = require('mongoose')


const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    category: {
        type: String,
        default: "General"
    },
    cover: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    rate: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
}, { timestamps: true, strict: true })


module.exports = mongoose.model('postModel', PostsSchema, 'posts')