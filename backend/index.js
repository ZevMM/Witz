const express = require('express')
const app = express()
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const pl = require('nodejs-polars'); 
const axios = require('axios');
const math = require('mathjs')
const sim = require('./sim.js')
const rebalance = require('./rebalancing.js')


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
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.get(`SELECT * FROM user123 ORDER BY Date DESC`, function(err, row) {
      response.json(Object.values(row).slice(1).reduce((sum, cur) => sum += cur)  )
    });
  })

})

app.post('/volatility', (request, response) => {

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT * FROM user123`, function(err, rows) {  
      let df = pl.DataFrame(rows)

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


app.get('/diversificationratio', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT * FROM user123 ORDER BY Date`, (err, rows) => {
      let numassets = Object.keys(rows[0]).length - 1
      let prices = Array(numassets).fill(0).map(a => Array(rows.length))
      let LogReturns = Array(numassets).fill(0).map(a => Array(rows.length - 1))
      let tv = Object.values(rows.at(-1)).slice(1).reduce((p, c) => p+c)
      let weights = Object.values(rows.at(-1)).slice(1).map(v => v / tv)

      rows.forEach((row, i) => {
        let temp = Object.values(row).slice(1)
        temp.map((p,x) => prices[x][i] = p)
      })

      for (let i = 1; i< rows.length; i++) {
        for (let s = 0; s < numassets; s++) {
          LogReturns[s][i] = prices[s][i] / prices[s][i - 1] - 1
        }
      }

      let avgs = LogReturns.map(s => s.reduce((p, c) => p+c) / s.length)
      let covMatrix = Array(numassets).fill(0).map(a => Array(numassets).fill(0))
      for (let a = 0; a < numassets; a++) {
        for (let b = 0; b <= a; b++) {
          covMatrix[a][b] = covMatrix[b][a] = LogReturns[a].reduce((prev, cur, ix) => prev + (cur - avgs[a]) * (LogReturns[b][ix] - avgs[b]), 0) / rows.length
        }
      }
      let stdDevs = weights.map((_, i) => Math.sqrt(covMatrix[i][i]))
      let weightXcovXweight = covMatrix.map(r => (r.map((v,i) => v * weights[i])).reduce((p,c) => p + c)).map((v,i) => v*weights[i]).reduce((p,c) => p+c)
      stdDevs = stdDevs.map((v,i) => v * weights[i]).reduce((p,c) => p+c)
      response.json(stdDevs / Math.sqrt(weightXcovXweight))



    })
  })
})



app.post('/diversificationratio', (request, response) => {
  try {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('user123');", (err, rows) => {
      const allassets = rows.slice(1).map(o => o.name) 
      if (allassets.length < 2) {
        response.json({"message" : "Need > 1 asset"})
        return
      }
      db.all(`SELECT * FROM user123`, function(err, rows) {
        let df = []
        rows.forEach(row => {
          let prices = Object.values(row).slice(1)
          df.push(prices)
        })

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
      })})
  })
 } catch (error) {
  console.log(error)
 }
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
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123`, function(err, rows) {  
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
  console.log(portfolio)

  let stocks = portfolio[0]["data"].slice(1)
  let all = []
  let cats = []
  const colors = ["#ed6268", "#7aa5e2", "#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    //make sure this is newest, not oldest

    db.get(`SELECT * FROM user123`, function(err, row) {  
      portfolio.forEach((c, q) => {
        if (c.data.length > 1) {
          let prices = c.data.slice(1).map(d => {return {name: d[0], val: row[d[0]]}})
          prices.sort((a, b) => a.val - b.val)
          prices = prices.map((p, i) => {
            const ext = Math.floor(45 * (i + 1) / prices.length + 44)
            return({"name" : p.name, "value" : p.val, "fill": ext > 9 ? `${colors[q]}${ext}` : `${colors[q]}0${ext}`})
          })
          all.push(...prices)
          cats.push({"name" : c.title, "value": prices.reduce((sum, cur) => sum + cur.value, 0), "fill": `${colors[q]}`})
        }
      })
      let toReturn = {
        "data1" : all,
        "data2" : cats
      }
      console.log(toReturn)
      response.json(toReturn)
    });
  })
})


app.get('/riskpiechart', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT * FROM user123 ORDER BY Date`, (err, rows) => {
      let numassets = Object.keys(rows[0]).length - 1
      let prices = Array(numassets).fill(0).map(a => Array(rows.length))
      let LogReturns = Array(numassets).fill(0).map(a => Array(rows.length - 1))
      let tv = Object.values(rows.at(-1)).slice(1).reduce((p, c) => p+c)
      let weights = Object.values(rows.at(-1)).slice(1).map(v => v / tv)

      rows.forEach((row, i) => {
        let temp = Object.values(row).slice(1)
        temp.map((p,x) => prices[x][i] = p)
      })

      for (let i = 1; i< rows.length; i++) {
        for (let s = 0; s < numassets; s++) {
          LogReturns[s][i] = prices[s][i] / prices[s][i - 1] - 1
        }
      }

      let avgs = LogReturns.map(s => s.reduce((p, c) => p+c) / s.length)

      let covMatrix = Array(numassets).fill(0).map(a => Array(numassets).fill(0))

      for (let a = 0; a < numassets; a++) {
        for (let b = 0; b <= a; b++) {
          covMatrix[a][b] = covMatrix[b][a] = LogReturns[a].reduce((prev, cur, ix) => prev + (cur - avgs[a]) * (LogReturns[b][ix] - avgs[b]), 0) / rows.length
        }
      }

      let covXweight = covMatrix.map(r => (r.map((v,i) => v * weights[i])).reduce((p,c) => p + c))
      let riskContributions = covXweight.map((v,i) => v * weights[i])
      //no need to calculate portfolio volatility because I just want to know the relative contributions
      

      let Rtotal = riskContributions.reduce((p,c) => p+c)
      let names = Object.keys(rows[0]).slice(1)
      let pcts = weights.map((w, i) => {return {"name" : names[i], "value": riskContributions[i] * 100 / Rtotal}} )
      
      response.json(pcts)

    })
  })
})


app.post('/tstable', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = df.toObject()

      response.json(toReturn)
    })
  })
})


app.post('/linegraph', (request, response) => {
  //do I want to scale relative to average or do pct change?
  //I should make the keys the asset names
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123`, function(err, rows) {  
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

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('user123');", (err, rows) => {
      const allassets = rows.slice(1).map(o => o.name) 
      db.get("SELECT * FROM user123 ORDER BY Date DESC", (err, row) => {
        const initvalues = Object.values(row).slice(1)
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
        
        const names = request.body.names
        const events = request.body.events
        const reb = request.body.rebalance
        const numsims = parseInt(request.body.numsims)
        const numsteps = parseInt(request.body.numsteps)
        const levs = request.body.levs
          db.all(`SELECT ${allassets.concat(names).join(",")} FROM monthlyStock INNER JOIN indices ON monthlyStock.Date = indices.DATE
          INNER JOIN ETFs ON indices.DATE = ETFs.Date
          INNER JOIN crypto ON ETFs.Date = crypto.Date
          INNER JOIN currency ON crypto.Date = currency.Date
          INNER JOIN mutualFunds ON currency.Date = mutualFunds.Date
          INNER JOIN realEstate ON realEstate.Date = mutualFunds.Date`, function(err, rows) {
  
            
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
            let lagMatrix = new Array(drifts.length).fill(0).map(() => new Array(drifts.length).fill(0))
            
            for (let i = 0; i < drifts.length; i++){
              for (let n = 0; n <= i; n++) {
                
                let a = allLogReturns[i]
                let b = allLogReturns[n]
                let maxcov = a.reduce((sum, val, indx) => sum + (val - drifts[i]) * (b[indx] - drifts[n]), 0) / (a.length - 1)
                for (let l = 1; l < 4; l ++) {
                  let cova = a.slice(l).reduce((sum, val, indx) => sum + (val - drifts[i]) * (b[indx] - drifts[n]), 0) / (a.length - 1 - l)
                  console.log("cova", cova)
                  if (Math.abs(cova) > maxcov) {
                    maxcov = cova
                    lagMatrix[i][n] = -l
                    lagMatrix[n][i] = l
                  }
                  let covb = b.slice(l).reduce((sum, val, indx) => sum + (val - drifts[n]) * (a[indx] - drifts[i]), 0) / (b.length - 1 - l)
                  console.log("covb", covb)
                  if (Math.abs(covb) > maxcov) {
                    maxcov = covb
                    lagMatrix[n][i] = -l
                    lagMatrix[i][n] = l
                  }
  
                }
  
                covMatrix[i][n] = maxcov 
                covMatrix[n][i] = maxcov
              }
            }
            console.log(covMatrix)
            console.log(lagMatrix)
  
            let simData = sim.GBM(drifts, vols, numsims, allassets.length, numsteps, starts, covMatrix, names.length, events, lagMatrix)
            if (levs.some(ele => ele != 1)) {simData = rebalance.lever(simData, initvalues, numsims, numsteps, levs)}
            if (reb) {simData = rebalance.rebalance(simData, numsims, initvalues, numsteps)}
            else {simData = rebalance.weight(simData, initvalues)}
      
            if (numsims > 1){
              for (let i = 0; i < numsteps; i++){
                let entry = {"date": i}
                let allprices = []
                for (let p =0; p< numsims; p++) {
                  let tot = 0
                  for (let n = 0; n < allassets.length; n++){
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
              
              for (let n = 0; n < allassets.length; n++){
                for (let p =0; p< numsims; p++) {
                entry[allassets[n][0]] = simData[n][i][p]
                }
              }
              
              toReturn.push(entry)
            }
            response.json(toReturn)
        })
      })
    })
  })


})

app.get('/myportfolio', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('user123');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/monthlyStock', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('monthlyStock');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/realEstate', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('realEstate');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/mutualFunds', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('mutualFunds');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/ETFs', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('ETFs');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/crypto', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('crypto');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})

app.get('/commodities', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('commodities');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})
//pretty sure I could have made all of these into one function.
app.get('/currency', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT name FROM PRAGMA_TABLE_INFO('currency');", (err, rows) => response.json(rows.slice(1).map(o => o.name)) )
  })
})


app.post('/adduser', (request, response) => {
  console.log("new user")
  const user = request.body.name
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.run(`DROP TABLE IF EXISTS ${user}`, err => {
      db.run(`CREATE TABLE ${user}(Date date)`, (err) => {
        if (err) {
          console.log(err.message)
          return
        }
        db.all(`SELECT Date FROM monthlyStock`, (err, rows) => {
          rows.forEach(row => {
            db.run(`INSERT INTO ${user}(Date) VALUES(?)`, row.Date, (err) => {
              if (err) {
                console.error(err.message);
            }})
          })
        })
      })
    })
  })
})

app.post('/deleteuser', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.run(`DROP TABLE IF EXISTS ${request.body.name}`, (err) => {if (err) {
      console.error(err.message);
  }})
  })
})

app.get('/test', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM "user123"`, (err, rows) => console.log(err, rows))
  })
})

app.post('/portfolioAdd', (request, response) => {
  
  const cat = request.body.cat
  const data = request.body.data
  const name = data[0]
  const principal = data[1]
  let date = data[2]
  date = 12 * (parseInt(date.slice(0,4)) - 2019) + parseInt(date.slice(5,7)) - 7
  const leverage = data[3]
  const user = "user123"
  
  let db = new sqlite3.Database('asset-values', (err) => {
    
    db.run(`ALTER TABLE ${user} ADD COLUMN ${name} number`, (err) => {
      db.all(`SELECT Date, ${name} FROM ${cat} ORDER BY Date`, (err, rows) => {
        
        if (leverage > 1) {
          let returns = []
          for(let i = 1; i < rows.length; i++) {
            returns.push((rows[i][name] / rows[i-1][name]) - 1)
          }
          for (let i = 0; i < returns.length; i++) {
            // if it goes negative I should set it to zero
            let newval = (leverage * returns[i] + 1) * rows[i][name]
            if (newval < 0) {
              newval = 0
            }
            rows[i+1][name] = newval
          }
        }

        const quantity = (principal / rows[date][name])
        rows.forEach(row => {
          db.run(`UPDATE ${user} SET ${name} = ? WHERE Date = ?`,(quantity * row[name]), (row.Date), err => {if (err) {
            console.error(err.message);
        }})
        })
      })
    })
  })
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
