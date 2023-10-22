const express = require('express')
const mongoose = require('mongoose')
const logger = require('./middlewares/logger')
const authorsRoute = require('./routes/authors')
const blogPostsRoute = require('./routes/blogPosts')
const commentsRoute = require('./routes/comments')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const PORT = 5050;

const app = express();

// middleware cors
app.use(cors())

// middleware path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// middleware parser json
app.use(express.json())

// middleware logger
app.use(logger)

// routes
app.use('/', authorsRoute)
app.use('/', blogPostsRoute)
app.use('/', commentsRoute)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore durante la connessione al database!'))
db.once('open', () => {
    console.log('Connessione al database riuscita con successo!')
})

app.listen(PORT, () => console.log(`Il Server è in funzione sulla porta ${PORT}`))