const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false,
        default: "General"
    },
    cover: {
        type: String,
        required: false,
        default: "https://images.pexels.com/photos/296115/pexels-photo-296115.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    readTime: {
        value: {
            type: Number,
            required: false,
            default: 1
        },
        unit: {
            type: String,
            required: false,
            default: "min"
        }
    },
    author: {
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: false
        }
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('postModel', PostsSchema, 'posts')