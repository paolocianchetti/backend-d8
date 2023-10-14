const express = require('express')
const CommentModel = require('../models/comment')
const comments = express.Router()

comments.get('/comments', async (request, response) => {
    const { page = 1, pageSize = 3 } = request.query
    try {
        const comments = await CommentModel.find()
            .populate('post')
            .limit(pageSize)
            .skip((page - 1) * pageSize)
        
        const totalComments = await CommentModel.count()

        response.status(200)
            .send({
                statusCode: 200,
                currentPage: Number(page),
                totalPages: Math.ceil(totalComments / pageSize),
                totalComments,
                comments
            })
    } catch (error) {
        console.log(error)
        response.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

comments.get('/comments/:commentId', async (request, response) => {
    const { commentId } = request.params;

    try {
        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            return response.status(404).send({
                statusCode: 404,
                message: "Commento non trovato"
            })
        }

        response.status(200).send({
            statusCode: 200,
            comment
        })
    } catch (error) {
        console.log(error)
        response.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

comments.post('/comments/create', async (request, response) => {

    const newComment = new CommentModel({
        review: request.body.review,
        rate: Number(request.body.rate),
        post: request.body.post
    })

    try {
        const comment = await newComment.save()

        response.status(201).send({
            statusCode: 201,
            message: "Commento salvato con successo",
            payload: comment
        })
    } catch (error) {
        console.log(error)
        response.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

comments.patch('/comments/update/:commentId', async (request, response) => {
    const { commentId } = request.params;

    const commentExist = await CommentModel.findById(commentId)

    if (!commentExist) {
        return response.status(404).send({
            statusCode: 404,
            message: "Questo commento non esiste"
        })
    }

    try {
        const dataToUpdate = request.body
        const options = {new: true}
        const result = await CommentModel.findByIdAndUpdate(commentId, dataToUpdate, options)

        response.status(200).send({
            statusCode: 200,
            message: "Commento modificato con successo",
            result
        })
    } catch (error) {
        console.log(error)
        response.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

comments.delete('/comments/delete/:commentId', async (request, response) => {
    const { commentId } = request.params

    try {
        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            return response.status(404).send({
                statusCode: 404,
                message: "Commento non trovato o già cancellato"
            })
        }
        const deletedComment = await CommentModel.findByIdAndDelete(commentId)
        response.status(200).send({
            statusCode: 200,
            message: "Commento cancellato con successo",
            deletedComment
        })
    } catch (error) {
        console.log(error)
        response.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

module.exports = comments