const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel'
    },
}, {
    timestamps: true,
    strict: true
    }
)

module.exports = mongoose.model('commentModel', CommentSchema, 'comments')