const express = require('express')
const app = express()
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();


app.use(express.json())
app.use(cors())

let report = {
  "data" : 
      {
          "data1" : [{"name": "Page A", "uv": 400, "pv": 2400, "amt": 2400}, 
                  {"name": "Page B", "uv": 300, "pv": 2400, "amt": 2400},
                  {"name": "Page C", "uv": 300, "pv": 2400, "amt": 2400},
                  {"name": "Page D", "uv": 200, "pv": 2400, "amt": 2400},
                  {"name": "Page E", "uv": 278, "pv": 2400, "amt": 2400},
                  {"name": "Page F", "uv": 189, "pv": 2400, "amt": 2400}],
          "data2" : [
                  {
                    "name": "Page A",
                    "uv": 4000,
                    "pv": 2400,
                    "amt": 2400
                  },
                  {
                    "name": "Page B",
                    "uv": -3000,
                    "pv": 1398,
                    "amt": 2210
                  },
                  {
                    "name": "Page C",
                    "uv": -2000,
                    "pv": -9800,
                    "amt": 2290
                  },
                  {
                    "name": "Page D",
                    "uv": 2780,
                    "pv": 3908,
                    "amt": 2000
                  },
                  {
                    "name": "Page E",
                    "uv": -1890,
                    "pv": 4800,
                    "amt": 2181
                  },
                  {
                    "name": "Page F",
                    "uv": 2390,
                    "pv": -3800,
                    "amt": 2500
                  },
                  {
                    "name": "Page G",
                    "uv": 3490,
                    "pv": 4300,
                    "amt": 2100
                  }
                ],
          "data3" : { "data1" : [
              { "name": "Group A", "value": 400 },
              { "name": "Group B", "value": 300 },
              { "name": "Group C", "value": 300 },
              { "name": "Group D", "value": 200 }
            ],
            "data2" : [
              { "name": "A1", "value": 100 },
              { "name": "A2", "value": 300 },
              { "name": "B1", "value": 100 },
              { "name": "B2", "value": 80 },
              { "name": "B3", "value": 40 },
              { "name": "B4", "value": 30 },
              { "name": "B5", "value": 50 },
              { "name": "C1", "value": 100 },
              { "name": "C2", "value": 200 },
              { "name": "D1", "value": 150 },
              { "name": "D2", "value": 50 }
          ]},
          "data4" : 1,
          "data5" : 2,
          "data6" : 3
      }
}

let stockdata = {
  "AAPL" : {price: [0, 1, 2, 3, 4]},
  "MSFT" : {price: [5, 6, 7, 8, 9]},
}


function generateReport(portfolio) {
  let stocks = portfolio[0]["data"].slice(1)
  let bonds = portfolio[1]["data"].slice(1)
  let all = []
  let cats = []

  let maxStock = Math.max(...stocks.map(stock => stock[1] * stockdata[stock[0]].price.at(-1)))
  stocks = stocks.map(stock => {
    let value = stock[1] * stockdata[stock[0]].price.at(-1)
    let ratio = Math.floor(value * 99 / maxStock)
    return ({ "name": stock[0], "value": value, "fill": ratio > 9 ? `#ed6268${ratio}` : `#ed62680${ratio}` })
  })
  all = all.concat(stocks)
  cats.push({ "name": "Stocks", "value": stocks.reduce((sum, stock) => stock.value + sum, 0), "fill": "#ed6268"  })

  let maxBond = Math.max(...bonds.map(bond => parseInt(bond[0])))
  bonds = bonds.map(bond => {
    let value = parseInt(bond[0])
    let ratio = Math.floor(value * 99 / maxBond)
    return ({ "name": `${bond[2]} bond`, "value": value, "fill": ratio > 9 ? `#faac34${ratio}` : `#faac340${ratio}` })
  })
  all = all.concat(bonds)
  cats.push({ "name": "Bonds", "value": bonds.reduce((sum, bond) => bond.value + sum, 0), "fill" : "#faac34"})

  report["data"]["data3"]["data1"] = all
  report["data"]["data3"]["data2"] = cats
  report["data"]["data4"] = cats.reduce((sum, category) => sum + category["value"], 0)
}



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/data', (request, response) => {

  response.json(report)
})

app.post('/data', (request, response ) => {
  const portfolio = request.body
  
  //generateReport(portfolio)
  response.json(report.data)
})

app.post('/totalvalue', (request, response) => {
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  let stockprices = null
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.get(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, row) {  
        console.log("row", row)
        response.json(Object.values(row).reduce((s, c) => s += c))
    });
  })

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
