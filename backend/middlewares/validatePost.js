const validatePost = (request, response, next) => {
    const errors = []
    const { title, category, cover, readTime, author, content } = request.body;

    if (typeof title !== 'string') {
        errors.push('Il titolo del post deve essere una stringa!')
    }
    if (typeof category !== 'string') {
        errors.push('La categoria del post deve essere una stringa!')
    }
    if (typeof cover !== 'string') {
        errors.push('La cover deve essere un link immagine in formato stringa!')
    }
    if (typeof readTime.value !== 'number') {
        errors.push('La proprietà value deve essere di tipo numerico!')
    }
    if (typeof readTime.unit !== 'string') {
        errors.push('La unit deve essere una stringa (ad esempio: min, sec, ore)')
    }
    if (typeof author.name !== 'string') {
        errors.push('Il nome autore del post deve essere una stringa!')
    }
    if (typeof author.avatar !== 'string') {
        errors.push('La proprietà avatar deve essere di tipo stringa!')
    }
    if (typeof content !== 'string') {
        errors.push('Il contenuto del post deve essere in formato stringa!')
    }

    if (errors.length > 0) {
        response
            .status(400)
            .send({ errors })
    } else {
        next()
    }
}

module.exports = validatePost