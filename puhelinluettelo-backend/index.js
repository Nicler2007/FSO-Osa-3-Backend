const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const PORT = 3001

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

const persons = [
  { id: 1, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 2, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 3, name: 'Mary Poppendieck', number: '39-23-6423122' },
  { id: 4, name: 'Alan Turing', number: '44-23-6423122' }, 
  { id: 5, name: 'Jack Daniels', number: '49-75-1403128' } 
]

// ID generaattori
const generateId = () => {
  let id = Math.floor(Math.random() * 1000000)

  while (persons.some(person => person.id === id)) {
    id = Math.floor(Math.random() * 1000000)
  }

  return id
}

// Info
app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// Hae yksi henkilö
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// Hae kaikki henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Poista henkilö
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personIndex = persons.findIndex(person => person.id === id)

  if (personIndex === -1) {
    return res.status(404).end()
  }

  persons.splice(personIndex, 1)

  res.status(204).end()
})

// Lisää uusi henkilö
app.post('/api/persons', (req, res) => {
  const body = req.body

  // Nimi tai numero puuttuu
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // Nimi on jo käytössä
  const nameExists = persons.some(person => person.name === body.name)

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons.push(person)

  res.json(person)
})

// Käynnistetään palvelin
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})