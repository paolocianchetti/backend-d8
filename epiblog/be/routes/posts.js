const express = require('express')
const PostModel = require('../models/post')
const validatePost = require('../middlewares/validatePost')
const posts = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()
const crypto = require('crypto')
const verifyToken = require('../middlewares/verifyToken')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pippo13',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})

const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // posizione in cui salvare i file
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        // generiamo un suffisso unico per il nostro file
        const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`
        // qui ci recuperiamo da tutto solo l'estensione dello stesso file
        const fileExtension = file.originalname.split('.').pop()
        // eseguiamo la cb con il titolo completo
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

const upload = multer({ storage: internalStorage })
const cloudUpload = multer({ storage: cloudStorage })

posts.post('/posts/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        res.status(200).json({ cover: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.post('/posts/upload', upload.single('cover')  , async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}` // http://localhost:5050

    console.log(req.file)

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({ cover: `${url}/public/${imgUrl}` })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }

})

// vogliamo proteggere la rotta get usando il middleware verifyToken
posts.get('/posts', verifyToken, async (req, res) => {
    const { page = 1, pageSize = 3 } = req.query
    try {
        const posts = await PostModel.find()
            .populate('author')
            .limit(pageSize)
            .skip((page -1) * pageSize)

        const totalPosts = await PostModel.count()

        res.status(200)
            .send({
                statusCode: 200,
                currentPage: Number(page),
                totalPages: Math.ceil(totalPosts / pageSize),
                totalPosts,
                posts
            })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.get('/posts/bytitle', async (req, res) => {
    const {title} = req.query;
    try {
        const postByTitle = await PostModel.find({
            title: {
                $regex: title,
                $options: 'i'
            }
        })

        res.status(200).send(postByTitle)
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.get('/posts/bydate/:date', async (req, res) => {
    const {date} = req.params

    try {
        const getPostByDate = await PostModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    {$dayOfMonth: '$createdAt'},
                                    {$dayOfMonth: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    {$month: '$createdAt'},
                                    {$month: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    {$year: '$createdAt'},
                                    {$year: new Date(date)}
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        res.status(200).send(getPostByDate)
    } catch (e) {

    }
})

posts.get('/posts/byid/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const post = await PostModel.findById(id)
        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "post not found"
            })
        }

        res.status(200).send({
            statusCode: 200,
            post
        })
    } catch (e) {

    }
})

posts.post('/posts/create', validatePost, async (req, res) => {

    const newPost = new PostModel({
        title: req.body.title,
        category: req.body.category,
        cover: req.body.cover,
        price: Number(req.body.price),
        rate: Number(req.body.rate),
        author: req.body.author
    })

    try {
        const post = await newPost.save()

        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: post
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.patch('/posts/update/:postId', async (req, res) => {
    const {postId} = req.params;

    const postExist = await PostModel.findById(postId)

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    try {
        const dataToUpdate = req.body;
        const options = {new: true};
        const result = await PostModel.findByIdAndUpdate(postId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post edited successfully",
            result
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.delete('/posts/delete/:postId', async (req, res) => {
    const {postId} = req.params;

    try {
        const post = await PostModel.findByIdAndDelete(postId)
        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Post deleted successfully"
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

module.exports = posts