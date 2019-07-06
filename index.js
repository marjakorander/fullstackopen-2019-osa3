const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let phoneNumbers = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 5
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phoneNumbers)
})

app.get('api/info', (req, res) => {
    res.write('<p>Phonebook has info for ' + phoneNumbers.length + ' people</p>');
    res.write(Date())
})

app.get('/api', (req, res) => {
    res.send('/index.html')
})

app.get('api/morgan', (req, res) => {
    res.send('Hello from Morgan!')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const phoneNumber = phoneNumbers.find(phoneNumber => phoneNumber.id === id)
    if (phoneNumber) {
        response.json(phoneNumber)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneNumbers = phoneNumbers.filter(phoneNumber => phoneNumber.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const generatedId = phoneNumbers.length > 0
    ? Math.floor(Math.random() * Math.floor(10000))
    : 0
   return generatedId
}

app.post('/api/persons', (request, response) => {
    console.log('Request body', request.body)
    const personDetails = request.body

    if (!personDetails.name || !personDetails.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })   
    }
    if (phoneNumbers.some(number => number.name === personDetails.name)) {
        return response.status(400).json({
            error: 'name already in list'
        })
    }

    const phoneNumber = {
        name: personDetails.name,
        number: personDetails.number,
        id: generateId(),
    }

    phoneNumbers = phoneNumbers.concat(phoneNumber)
    response.json(phoneNumber)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})