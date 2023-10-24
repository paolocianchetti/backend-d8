const express = require('express')
const gh = express.Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const jwt = require('jsonwebtoken')
const session = require('express-session')
require('dotenv').config()

// scriviamo la nostra strategy

// diciamo a gh di usare le sessioni di express
gh.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

// inizializziamo il middleware 'passport'
// e diciamo a gh di utilizzarlo
gh.use(passport.initialize())

// inizializziamo l'istanza della sessione di passport
gh.use(passport.session())

// serializziamo l'utente
passport.serializeUser((user, done) => {
    done(null, user)
})

// deserializziamo l'utente
passport.deserializeUser((user, done) => {
    done(null, user)
})

// definiamo la Strategy di GitHub attraverso un middleware
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        (accessToken, refreshToken, profile, done) => {
            // stampiamo il profilo utente
            console.log('PROFILE', profile)
            return done(null, profile)
        }
    )
)

// ora creaimo le rotte che 'passport' esaminerà in sequenza per dire al server cosa fare

// creaimo la prima rotta passando il middleware 'passport.authenticate'
// con 'scope: [user:email]'
gh.get('/auth/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {
    // restituiamo al frontend una rotta con le informazioni dell'utente che ha richiesto
    // il login, però in una stringa confusa, per non rendele visibili
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(redirectUrl) 
})

// creaimo una seconda rotta di callback per gestire anche il caso del login
// non andato a buon fine. In tal caso faremo un redirect alla pagina root del frontend
gh.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    // prendiamo i dati dell'utente
    const user = req.user

    // stampiamone i dati
    console.log('LOG USER', user)

    // generiamo il token per questo utente
    const token = jwt.sign(user, process.env.JWT_SECRET)

    // trasmettiamo quel token al frontend attraverso il parametro
    // lato frontend decodificheremo questo token per risalire alle info dell'utente
    const redirectUrl = `http://localhost:3000/success/${encodeURIComponent(token)}`
    res.redirect(redirectUrl)
})

// creaimo l'ultima rotta che sposta l'utente sulla HomePage del sito, nel caso
// in cui tutto quello visto prima è andato a buon fine
gh.get('/success', (req, res) => {
    res.redirect('http://localhost:3000/home')
})

module.exports = gh;