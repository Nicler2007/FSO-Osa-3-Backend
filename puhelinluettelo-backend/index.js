const express = require('express')
const app = express()

const PORT = 3001

app.use(express.json())

const persons = [
  { id: 1, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 2, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 3, name: 'Mary Poppendieck', number: '39-23-6423122' },
  { id: 4, name: 'Alan Turing', number: '44-23-6423122' }
]

// ID generaattori
const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

// STEP 3.2 - info
app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// STEP 3.3 - hae yksi henkilö
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// GET kaikki
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// STEP 3.5 & 3.6 - lisää uusi + validointi
app.post('/api/persons', (req, res) => {
  const body = req.body

  // puuttuva data
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // uniikki nimi
  const nameExists = persons.some(p => p.name === body.name)
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})