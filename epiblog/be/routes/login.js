const express = require('express')
const login = express.Router()
const UserModel = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

// abbiamo una sola rotta post
login.post('/login', async (req, res) => {
    // recuperiamo l'utente che sta facendo il Login
    // facciamo una ricerca per email essendo univoca per ciascuno
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: "Nome utente errato o inesistente",
            statusCode: 404
        })
    }

    // controlliamo la validità della password attraverso il metodo 'compare' di bcrypt
    // che prende come primo argomento la password inserita in chiaro dall'utente e come
    // secondo argomento la password criptata memorizzata all'atto di creazione dell'utente
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
        return res.status(400).send({
            statusCode: 400,
            message: 'Email o password errati.'
        })
    }

    // generiamo il Token
    const token = jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '72h'
    })

    // restituiamo il token generato nell'header della nostra richiesta Login
    res.header('Authorization', token).status(200).send({
        message: 'Login effettuato con successo',
        statusCode: 200,
        token
    })
})

module.exports = login;