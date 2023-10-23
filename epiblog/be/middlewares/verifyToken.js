const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    // prendiamo il token generato dalla rotta di login
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).send({
            errorType: 'Token non presente',
            statusCode: 401,
            message: "Per poter utilizzare questo endpoint è necessario un token di accesso"
        })
    }

    try {
        // verifichiamo la validità del token ricevuto
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // se il token è valido lo aggiunge al campo user della request
        req.user = verified

        next()
    } catch (e) {
        res.status(403).send({
            errorType: 'Token error',
            statusCode: 403,
            message: 'Il token è scaduto o non valido'
        })
    }
}