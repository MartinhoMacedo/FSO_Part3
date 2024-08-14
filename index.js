const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require ('./models/person')

app.use(express.static('dist'))
app.use(cors())

morgan.token('content', (req, res) => {
  if(!JSON.stringify(req.body)) return null
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
Phonebook has info for ${persons.length} people <br/>
${date}
  `)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = Person.findById(id).then(person => {
    if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 10000000)

  const body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  if(persons.map(person => person.name).includes(body.name)){
    return response.status(400).json({
      error: "name already exists"
    })
  }

  const person = {
    id: String(id),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
