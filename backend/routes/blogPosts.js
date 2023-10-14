const express = require('express')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const validatePost = require('../middlewares/validatePost')
const blogPosts = express.Router()

blogPosts.get('/blogPosts', async (request, response) => {
    const { title } = request.query;

    try {
        if (!title) {
            const posts = await PostModel.find()
            response
                .status(200)
                .send({
                    statusCode: 200,
                    posts
                })
        } else {
            const postByTitle = await PostModel.find({
                title: {
                    $regex: title,
                    $options: 'i'
                }
            })
            response
                .status(200)
                .send(postByTitle)
        }
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.get('/blogPosts/:id', async (request, response) => {
    const { id } = request.params

    try {
        const post = await PostModel.findById(id)
        if (!post) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Post non trovato!"
                })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.get('/blogPosts/:id/comments', async (request, response) => {
    const { id } = request.params

    try {
        const post = await PostModel.findById(id)

        if (!post) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Post non trovato!"
                })
        }
        
        const comments = await CommentModel.find({
            post: id
        })

        if (!comments) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Commenti non trovati per il post selezionato"
                })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                comments
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.get('/blogPosts/:id/comments/:commentId', async (request, response) => {
    const { id, commentId } = request.params

    try {
        const post = await PostModel.findById(id)

        if (!post) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Post non trovato!"
                })
        }
        
        const comment = await CommentModel.findOne({
            _id: commentId,
            post: id
        })

        if (!comment) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Commento non trovato per il post selezionato!"
                })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                comment
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.post('/blogPosts', validatePost, async (request, response) => {

    const newPost = new PostModel({
        title: request.body.title,
        category: request.body.category,
        cover: request.body.cover,
        readTime: { value: Number(request.body.readTime.value), unit: request.body.readTime.unit },
        author: { name: request.body.author.name, avatar: request.body.author.avatar },
        content: request.body.content
    })

    try {
        const post = await newPost.save()

        response
            .status(201)
            .send({
                statusCode: 201,
                message: "Post creato con successo!",
                payload: post
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.post('/blogPosts/:id', async (request, response) => {
    const { id } = request.params

    const newComment = new CommentModel({
        review: request.body.review,
        rate: Number(request.body.rate),
        post: id
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

blogPosts.patch('/blogPosts/:id', async (request, response) => {
    const { id } = request.params
    const postExist = await PostModel.findById(id)

    if (!postExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Il post cercato non esiste!"
            })
    }

    try {
        const dataToUpdate = request.body
        const options = { new: true }
        const result = await PostModel.findByIdAndUpdate(id, dataToUpdate, options)

        response
            .status(200)
            .send({
                statusCode: 200,
                message: "Post modificato con successo!",
                result
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.patch('/blogPosts/:id/comment/:commentId', async (request, response) => {
    const { id, commentId } = request.params

    const postExist = await PostModel.findById(id)

    if (!postExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Il post cercato non esiste!"
            })
    }

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

        const result = await CommentModel.findOneAndUpdate(
            {
                _id: commentId,
                post: id
            }, 
                dataToUpdate, options
        )

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

blogPosts.delete('/blogPosts/:id', async (request, response) => {
    const { id } = request.params

    try {
        const post = await PostModel.findByIdAndDelete(id)
        if (!post) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Post non trovato o già cancellato!"
            })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                message: "Post cancellato con successo!"
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server!"
            })
    }
})

blogPosts.delete('/blogPosts/:id/comment/:commentId', async (request, response) => {
    const { id, commentId } = request.params

    const postExist = await PostModel.findById(id)

    if (!postExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Il post cercato non esiste!"
            })
    }

    const commentExist = await CommentModel.findById(commentId)

    if (!commentExist) {
        return response.status(404).send({
            statusCode: 404,
            message: "Questo commento non esiste!"
        })
    }

    try {
        const deletedComment = await CommentModel.findOneAndDelete({
            _id: commentId,
            post: id
        })
        response.status(200).send({
            statusCode: 200,
            message: "Commento selezionato cancellato con successo",
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

module.exports = blogPosts