const logger = (request, response, next) => {
    const { url, ip, method } = request

    console.log(`${new Date().toISOString()} Effettuata richiesta ${method} all'endpoint ${url} da ip ${ip}`)
    if (response) next()
}

module.exports = logger