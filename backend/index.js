const express = require('express')
const app = express()
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const pl = require('nodejs-polars'); 
const axios = require('axios');
const math = require('mathjs')
const sim = require('./sim.js')


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

function generateReport(portfolio) {
  let stocks = portfolio[0]["data"].slice(1)
  let all = []
  let cats = []

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    //make sure this is newest, not oldest
    db.get(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, row) {  
      let values = stocks.map((s, i) => s[1] * row[i])
      let maxval = Math.max(...values)
      all.push(stocks.map((s, i) => {
        let ratio = Math.floor(values[i] * 99 / maxval)
        return ({ "name" : s[0], "value" : values[i], "fill" : ratio > 9 ? `#ed6268${ratio}` : `#ed62680${ratio}` })
    }))
      cats.push({ "name": "Stocks", "value": [values.reduce((s, c) => s + c)], "fill": "#ed6268"  })
      
      let toReturn = {
        "data1" : all,
        "data2" : cats
      }

      response.json(toReturn)
    });
  })


/*
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
*/
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
  console.log(stocks)
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.get(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, row) {  
        response.json(stocks.reduce((sum, cur) => sum += (row[cur[0]] * cur[1]), 0))
    });
  })

})

app.post('/volatility', (request, response) => {
  
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT Date, ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      stocks.forEach(s => {
        df = df.withColumn(pl.col(s[0]).mul(parseInt(s[1])))
      });
      df = (df.withColumn(
        pl.sumHorizontal(pl.all().exclude("Date").alias("Total Value"))
      ))

      df = df.withColumn(pl.concatList([pl.col("Date"), pl.col("Total Value")]).alias("Str"))


      let assets = df.getColumn('Str').toArray()
      assets = assets.map(a => {return ({"date": a[0], "close": parseFloat(a[1])})})


      let test = {
        "assets": [
          {
            "assetPrices": assets
          }
        ]
      }


      axios
      .post('https://api.portfoliooptimizer.io/v1/assets/volatility/estimation/close-to-close', test)
      .then(r => {
        response.json(r.data.assets[0].assetVolatility)
      })

    });
  })
})

app.post('/diversificationratio', (request, response) => {
  
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  if (stocks.length < 2) {
    response.json({"message" : "Need > 1 asset"})
    return
  }

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)

      let returns = stocks.map(s => {
        return ({
          "assetReturns" : df[s[0]].sub(df[s[0]][0]).cast(pl.Float32).toArray()
        })
      })

      let covreq = {
        "assets": returns
      }


      axios
      .post('https://api.portfoliooptimizer.io/v1/assets/covariance/matrix', covreq)
      .then(r => {
        let total = stocks.reduce((sum, s) => sum += (df[s[0]][-1] * s[1]), 0)
        let weights = stocks.map(s => df[s[0]][-1] * s[1] / total)
        let divreq = {
          "assets": stocks.length,
          "assetsCovarianceMatrix": r.data.assetsCovarianceMatrix,
          "portfolios": [
            {
              "assetsWeights": weights
            }
          ]
        }
        axios
        .post('https://api.portfoliooptimizer.io/v1/portfolio/analysis/diversification-ratio', divreq)
        .then( r => {
          console.log(r.data)
        })

      })
    });
  })
})




function convertDateFormat(dateString) {
  // Split the input date string
  const [year, month, day] = dateString.split('-');
  
  // Convert year to 2-digit format
  const shortYear = year.slice(2);
  
  // Return the date in mm-dd-yy format
  return `${month}-${day}-${shortYear}`;
}


app.post('/areachart', (request, response) => {
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT Date, ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = []
      df.rows().forEach((row) => {
        let shortdate = convertDateFormat(row[0])
        let entry = {
          "date": shortdate,
          ...row.slice(1)
        }
        toReturn.push(entry)
      })
      response.json(toReturn)
    })
  })
})

app.post('/valuepiechart', (request, response) => {
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  let all = []
  let cats = []

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    //make sure this is newest, not oldest
    db.get(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, row) {  
      let values = stocks.map(s => {
        return(parseInt(s[1]) * row[s[0]])
    })
      
      let maxval = Math.max(...values)
      all = (stocks.map((s, i) => {
        let ratio = Math.floor(values[i] * 99 / maxval)
        return ({ "name" : s[0], "value" : values[i], "fill" : ratio > 9 ? `#ed6268${ratio}` : `#ed62680${ratio}` })
    }))
      cats.push({ "name": "Stocks", "value": values.reduce((s, c) => s + c), "fill": "#ed6268"  })
      
      let toReturn = {
        "data1" : all,
        "data2" : cats
      }
      console.log(toReturn)
      response.json(toReturn)
    });
  })
})

app.post('/riskpiechart', (request, response) => {
    
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  if (stocks.length < 2) {
    response.json({"message" : "Need > 1 asset"})
    return
  }

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)

      let returns = stocks.map(s => {
        return ({
          "assetReturns" : df[s[0]].sub(df[s[0]][0]).cast(pl.Float32).toArray()
        })
      })

      let covreq = {
        "assets": returns
      }


      axios
      .post('https://api.portfoliooptimizer.io/v1/assets/covariance/matrix', covreq)
      .then(r => {
        let E = math.matrix(r.data["assetsCovarianceMatrix"])
        let total = stocks.reduce((sum, s) => sum += (df[s[0]][-1] * s[1]), 0)
        let weights = stocks.map(s => df[s[0]][-1] * s[1] / total)
        const covXw = math.multiply(weights, E)["_data"]
        let Rtotal = weights.map((w, i) => w * covXw[i]).reduce((s, c) => s + c)
        let pcts = weights.map((w, i) => {return {"name" : stocks[i][0], "value": w * covXw[i] * 100 / Rtotal}} )
        response.json(pcts)



      })
    });
  })
})

app.post('/tstable', (request, response) => {
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT Date, ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = df.toObject()

      response.json(toReturn)
    })
  })
})


app.post('/linegraph', (request, response) => {
  //do I want to scale relative to average or do pct change?
  const portfolio = request.body
  let stocks = portfolio[0]["data"].slice(1)
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT Date, ${stocks.map((s => s[0])).join(", ")} FROM stockprices`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = []
      let avgs = []
      df.columns.slice(1).forEach((c) => avgs.push(df[c].toArray().reduce((s,c) => s + c) / df[c].length))
      df.rows().forEach((row) => {
        let shortdate = convertDateFormat(row[0])
        row = row.slice(1).map((r, i) => r / avgs[i])
        let entry = {
          "date": shortdate,
          ...row
        }
        toReturn.push(entry)
      })
      response.json(toReturn)
    })
  })
})


app.post('/simulate', (request, response) => {
  let toReturn = []

  const quantile = (sorted, q) => {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
  };

  const portfolio = request.body.portfolio
  const names = request.body.names
  const events = request.body.events
  const numsims = parseInt(request.body.numsims)
  const numsteps = parseInt(request.body.numsteps)
  let stocks = portfolio[0]["data"].slice(1)
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT ${stocks.map((s => s[0])).join(", ")}, ${names.join(",")} FROM monthlyStock INNER JOIN indices ON monthlyStock.date = indices.DATE `, function(err, rows) {
      let df = pl.DataFrame(rows)
      let drifts = []
      let vols = []
      let starts = []
      let allLogReturns = []
      
      df.columns.forEach(
        col => {
          let logReturns = [];
          col = df[col].toArray()
          for (let i = 1; i < col.length; i++) {
            let rt = Math.log(col[i] / col[i - 1]);
            logReturns.push(rt);
          }
          drifts.push(math.mean(logReturns))
          vols.push(math.std(logReturns))
          starts.push(col[0])
          allLogReturns.push(logReturns)
        }
      )
      let covMatrix = new Array(drifts.length).fill(0).map(() => new Array(drifts.length).fill(1))
      for (let i = 1; i < drifts.length; i++){
        for (let n = 0; n < i; n++) {
          let cov = allLogReturns[i].reduce((sum, val, indx) => sum + (val - drifts[i]) * (allLogReturns[n][indx] - drifts[n]), 0) / (allLogReturns[i].length - 1)
          covMatrix[i][n] = cov 
          covMatrix[n][i] = cov
        }
      }
      
      simData = sim.GBM(drifts, vols, numsims, stocks.length, numsteps, starts, covMatrix, names.length, events)

      if (numsims > 1){
        for (let i = 0; i < numsteps; i++){
          let entry = {"date": i}
          let allprices = []
          for (let p =0; p< numsims; p++) {
            let tot = 0
            for (let n = 0; n < stocks.length; n++){
              tot += simData[n][i][p]
            }
            entry[`tot${p}`] = tot
            allprices.push(tot)
          }
          allprices = allprices.sort((a, b) => a - b);
          entry["quantile25"] = quantile(allprices, 0.25)
          entry["quantile75"] = quantile(allprices, 0.75)
          toReturn.push(entry)
        }
        console.log(toReturn)
        response.json(toReturn)
        return
      }

      for (let i = 0; i < numsteps; i++){
        let entry = {"date": i}
        
        for (let n = 0; n < stocks.length; n++){
          for (let p =0; p< numsims; p++) {
          entry[stocks[n][0]] = simData[n][i][p]
          }
        }
        
        toReturn.push(entry)
      }
      response.json(toReturn)
    })
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
