const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const blogPosts = express.Router()
const validatePost = require('../middlewares/validatePost')
const crypto = require('crypto')  // genera Id casuali
require('dotenv').config()

// configurazione base di cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// configurazione per la gestione dei files nel Cloud
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatar',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})

// creaimo una costante per lo storage dei dati in una cartalla locale del server
const internalStorage = multer.diskStorage({
   destination: (request, file, cb ) => {
    cb(null, './uploads')  // posizione in cui salvare i files
   },
   // rendiamo i files univoci attraverso un suffisso
   filename: (request, file, cb) => {
    const fileSuffix = `${crypto.randomUUID()}_${Date.now()}`
    // recuperiamo solo l'estensione del file
    const fileExt = file.originalname.split('.').pop()
    // invochiamo la callback con il file univoco con l'estensione
    cb(null, `${file.fieldname}_${fileSuffix}.${fileExt}`)
   }
})

// middleware upload per internalStorage
const upload = multer({ storage: internalStorage })

// middleware cloudUpload per cloudStorage
const cloudUpload = multer({ storage: cloudStorage })

blogPosts.patch('/blogPosts/:id/cover', cloudUpload.single('cover'), async (request, response) => {
    const { id } = request.params  // id del post specifico

    // controlliamo se esite
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
        // ricavo il percorso del file nel cloud
        const cloudPath = request.file.path

        // costruisco l'oggetto json con la proprietà cover
        const dataToUpdate = JSON.stringify({ cover: `${cloudPath}`})
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

// deve caricare un'immagine per il post specificato dall'id nella cartella 'uploads'
blogPosts.patch('/blogPosts/:id/cover/uploads', upload.single('cover'), async (request, response) => {
    const { id } = request.params  // id del post specifico

    // controlliamo se esite
    const postExist = await PostModel.findById(id)

    if (!postExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Il post cercato non esiste!"
            })
    }

    // ricaviamo l'indirizzo url del server
    const url = `${request.protocol}://${request.get('host')}`

    console.log(request.file)

    try {
        // prendo l'url dell'immagine caricata
        const imgUrl = request.file.filename;

        // costruisco l'oggetto json con la proprietà cover
        const dataToUpdate = JSON.stringify({ cover: `${url}/uploads/${imgUrl}`})
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