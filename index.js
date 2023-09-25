const express = require("express")
const morgan = require("morgan")
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token("requestBody", (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms  :requestBody"
  )
)
// const requestLogger = (req,res,next)=> {
//   console.log('Request Method: '+req.method)
//   console.log('Request Body: ',req.body)
//   console.log('Request Path: '+req.path)
//   console.log('---------------------')
//   next()
// }
// app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/api/persons", (request, response,next) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find(
    (person) => person.id === Number(request.params.id)
  )

  if (!person) {
    return response.status(404).end()
  }
  response.json(person)
})

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  )
})

app.delete("/api/persons/:id", (req, res) => {
  const toBeDeleted = persons.find(
    (person) => person.id === Number(req.params.id)
  )

  if (!toBeDeleted) {
    response.status(404).end()
  } else {
    persons = persons.filter((person) => person.id !== Number(req.params.id))
    res.json(toBeDeleted)
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 100000000000000)
}

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body) {
    res.status(400).json({
      error: "body is missing",
    })
  } else if (!body.name) {
    res.status(400).json({
      error: "name is missing",
    })
  } else if (!body.number) {
    res.status(400).json({
      error: "number is missing",
    })
  } else {
    const alreadyExists = persons.find((person) => person.name === body.name)
    if (alreadyExists) {
      res.status(400).json({
        error: "name already exists in the phonebook",
      })
    } else {
      const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
      }

      persons.push(newPerson)
      res.json(newPerson)
    }
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
