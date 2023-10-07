const express = require('express')
const mongoose = require('mongoose')
const authorsRoute = require('./routes/authors')
const blogPostsRoute = require('./routes/blogPosts')

require('dotenv').config()

const PORT = 5050;

const app = express();

// middleware parser json
app.use(express.json())

// middleware routes
app.use('/', authorsRoute)
app.use('/', blogPostsRoute)

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