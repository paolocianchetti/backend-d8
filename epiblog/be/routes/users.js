const express = require('express')
const UserModel = require('../models/users')
const user = express.Router()
const bcrypt = require('bcrypt')

user.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find()

        res.status(200).send({
            statusCode: 200,
            users
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

user.post('/users/create', async (req, res) => {

    // definiamo la complessità dell'algoritmo di crypt
    const salt = await bcrypt.genSalt(10)
    // criptiamo la password in chiaro proveniente dalla request,
    // usando la complessità definita prima
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // definiamo il nuovo utente da salvare nella tabella degli utenti
    // ma con il campo password riempito con la password criptata
    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        // memorizziamo il nuovo utente nella tabella degli utenti, invocando il
        // metodo save()
        const user = await newUser.save()

        res.status(200).send({
            statusCode: 200,
            message: 'utente salvato con successo',
            user
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

module.exports = user