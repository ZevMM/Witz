const express = require('express')
const app = express()

let stockdata = [
  {id: "AAPL", price: [0, 1, 2, 3, 4]},
  {id: "MSFT", price: [5, 6, 7, 8, 9]},
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(stockdata)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})