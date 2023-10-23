const express = require('express')
const {createTransport} = require('nodemailer')
const email = express.Router()


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lia.price@ethereal.email',
        pass: '6x9hEAQr6CYZBx6FJS'
    }
});


email.post('/send-email', async (req, res) => {
    const { subject, text } = req.body

    const mailOptions = {
        from: 'noreply@alessandropozzato.com',
        to: 'lia.price@ethereal.email',
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            res.status(500).send('Errore durante invio mail')
        } else {
            console.log('email inviata!')
            res.status(200).send('Email inviata correttamente')
        }
    })

})

module.exports = email