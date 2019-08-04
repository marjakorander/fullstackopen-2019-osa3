const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(morgan('tiny'))
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

//Lint

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
})

app.get('/api/info', (request, response) => {
    Person.countDocuments({}, function (err, count) {
        console.log('Phonebook has info for ' + count + ' people')
        response.send('Phonebook has info for ' + count + ' people' + '<br><br>' + Date());
})})

app.get('/api', (request, response) => {
    response.send('<h1>Hello world!<h1>')
})

app.get('/api/morgan', (request, response) => {
    response.send('Hello from Morgan!')
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person.toJSON())
        } else {
            response.status(404).end()
        }    
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // if (body.name === undefined || body.number === undefined) {
    //     return response.status(400).json({ error: 'name and/or number missing '})
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = ({
        name: body.name,
        number: body.number,
    })

    Person.findByIdAndUpdate(request.params.id, person, { new: true})
        .then(updatedPerson =>
            response.json(Person.format(updatedPerson)))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'Cast error' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malfomatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})