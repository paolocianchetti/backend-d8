const express = require('express')
const AuthorModel = require('../models/author')
const authors = express.Router()

authors.get('/authors', async (request, response) => {
    try {
        const authors = await AuthorModel.find()

        response
            .status(200)
            .send({
                statusCode: 200,
                authors
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

authors.get('/authors/:id', async (request, response) => {
    const { id } = request.params

    try {
        const author = await AuthorModel.findById(id)
        if (!author) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Autore del post non trovato!"
                })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                author
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

authors.post('/authors', async (request, response) => {
    const newAuthor = new AuthorModel({
        nome: request.body.nome,
        cognome: request.body.cognome,
        email: request.body.email,
        dataDiNascita: request.body.dataDiNascita,
        avatar: request.body.avatar
    })

    try {
        const author = await newAuthor.save()

        response
            .status(201)
            .send({
                statusCode: 201,
                message: "Autore del post creato con successo!",
                payload: author
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

authors.patch('/authors/:id', async (request, response) => {
    const { id } = request.params
    const authorExist = await AuthorModel.findById(id)

    if (!authorExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Autore del post non esistente!"
            })
    }

    try {
        const dataToUpdate = request.body
        const options = { new: true }
        const result = await AuthorModel.findByIdAndUpdate(id, dataToUpdate, options)

        response
            .status(200)
            .send({
                statusCode: 200,
                message: "Autore del post modificato con successo!",
                result  // non è necessario ma lo mettiamo per fini didattici
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

authors.patch('/authors/:id/avatar', async (request, response) => {
    const { id } = request.params
    const authorExist = await AuthorModel.findById(id)

    if (!authorExist) {
        return response
            .status(404)
            .send({
                statusCode: 404,
                message: "Autore del post non esistente!"
            })
    }

    try {
        const dataToUpdate = request.body
        const options = { new: true }
        const result = await AuthorModel.findByIdAndUpdate(id, dataToUpdate, options)

        response
            .status(200)
            .send({
                statusCode: 200,
                message: "Autore del post modificato con successo!",
                result
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

authors.delete('/authors/:id', async (request, response) => {
    const { id } = request.params

    try {
        const author = await AuthorModel.findByIdAndDelete(id)
        if (!author) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: "Autore del post non trovato o già cancellato!"
            })
        }
        response
            .status(200)
            .send({
                statusCode: 200,
                message: "Autore del post cancellato con successo!"
            })
    } catch (error) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

module.exports = authors