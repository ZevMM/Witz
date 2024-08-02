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





app.post('/totalvalue', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.get(`SELECT * FROM user123 ORDER BY Date DESC`, function(err, row) {
      response.json(Object.values(row).slice(1).reduce((sum, cur) => sum += cur).toFixed(2))
    });
  })

})


app.get('/volatility/:start', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 WHERE Date > '${request.params.start}' ORDER BY Date`, (err, rows) => {
      let returns = []
      for (let i = 1; i < rows.length; i++) {
        let prev = Object.values(rows[i]).slice(1).reduce((p,c) => p+c)
        let cur = Object.values(rows[i - 1]).slice(1).reduce((p,c) => p+c)
        returns.push(prev / cur - 1)
      }
      avg_return = returns.reduce((p,c) => p+c) / returns.length
      let volatility = Math.sqrt(returns.reduce((p,c,i) => p + (c - avg_return) ** 2, 0) / (rows.length - 1))
      response.json(volatility.toFixed(6))
    })
  })
})
/*
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
        response.json(r.data.assets[0].assetVolatility.toFixed(6))
      })

    });
  })
})
*/

app.get('/diversificationratio/:start', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    db.all(`SELECT * FROM user123 WHERE Date > '${request.params.start}' ORDER BY Date`, (err, rows) => {
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
          LogReturns[s][i - 1] = prices[s][i] / prices[s][i - 1] - 1
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
      response.json((stdDevs / Math.sqrt(weightXcovXweight)).toFixed(6))

    })
  })
})


app.get('/corrmatrix', (request, response) => {
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
          LogReturns[s][i - 1] = prices[s][i] / prices[s][i - 1] - 1
        }
      }

      let avgs = LogReturns.map(s => s.reduce((p, c) => p+c) / s.length)
      let covMatrix = Array(numassets).fill(0).map(a => Array(numassets).fill(0))
      let lagMatrix = Array(numassets).fill(0).map(a => Array(numassets).fill(0))

      for (let i = 0; i < numassets; i++){
        for (let n = 0; n <= i; n++) {
          let a = LogReturns[i]
          let b = LogReturns[n]
          
          let maxcov = a.reduce((sum, val, indx) => sum + (val - avgs[i]) * (b[indx] - avgs[n]), 0) / (a.length - 1)


          for (let l = 1; l < 4; l ++) {
            let cova = a.slice(l).reduce((sum, val, indx) => sum + (val - avgs[i]) * (b[indx] - avgs[n]), 0) / (a.length - 1 - l)
            if (Math.abs(cova) > maxcov) {
              maxcov = cova
              lagMatrix[i][n] = -l
              lagMatrix[n][i] = l
            }
            let covb = b.slice(l).reduce((sum, val, indx) => sum + (val - avgs[n]) * (a[indx] - avgs[i]), 0) / (b.length - 1 - l)
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

      let stdDevs = weights.map((_, i) => Math.sqrt(covMatrix[i][i]))
      for (let a = 0; a < numassets; a++) {
        for (let b = 0; b <= a; b++) {
          let corr = covMatrix[a][b] / (stdDevs[a] * stdDevs[b])
          covMatrix[a][b] = covMatrix[b][a] = corr.toFixed(4)
        }
      }

      response.json({corr: covMatrix,lag: lagMatrix})

    })
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

app.get('/return/:start', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 WHERE Date = '2024-06-01' OR Date = '${request.params.start}' ORDER BY Date; `, (err,rows) => {
      let a = Object.values(rows[0]).slice(1).reduce((acc, cur) => acc + cur)
      let b = Object.values(rows[1]).slice(1).reduce((acc, cur) => acc + cur)
      response.json(((b-a)/a).toFixed(2))
    })
  })
})

app.post('/areachart', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 ORDER BY Date`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = []
      df.rows().forEach((row) => {
        let shortdate = convertDateFormat(row[0])
        row = row.slice(1).map((r, i) => parseFloat((r).toFixed(2)))
        let entry = df.columns.slice(1).reduce((acc, key, index) => {
          acc[key] = row[index];
          return acc;
        }, {"date":shortdate});

        toReturn.push(entry)
      })
      response.json(toReturn)
    })
  })
})


app.post('/sectorchart', (request, response) => {
  portfolio = request.body
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 ORDER BY Date`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = []


      df.rows().forEach((row,i) => {
        let shortdate = convertDateFormat(row[0])

        let entry = {
          "date": shortdate,
        }
        portfolio.forEach((cat) => {
          if (cat.data.length > 1) {
            let data = cat.data.slice(1)

            let tot = 0
            data.forEach((asset) => {
              
              tot += df[asset[0]][i]
            })
            entry[cat.title] = parseFloat(tot.toFixed(2))
            
          }
        })
        console.log(entry)
        toReturn.push(entry)
      })
      response.json(toReturn)
    })
  })
})

app.get('/sharpe/:start', (request, response) => {
  //once I add bonds, use the 10-year yield for risk free rate
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 WHERE Date > '${request.params.start}' ORDER BY Date`, (err, rows) => {
      let returns = []
      for (let i = 1; i < rows.length; i++) {
        let prev = Object.values(rows[i]).slice(1).reduce((p,c) => p+c)
        let cur = Object.values(rows[i - 1]).slice(1).reduce((p,c) => p+c)
        returns.push(prev / cur - 1)
      }
      avg_return = returns.reduce((p,c) => p+c) / returns.length
      let volatility = Math.sqrt(returns.reduce((p,c,i) => p + (c - avg_return) ** 2, 0) / (rows.length - 1))
      response.json(((avg_return - 0.04) / volatility).toFixed(6))
    })
  })
})

app.get('/ulcer/:start', (request, response) => {
  //once I add bonds, use the 10-year yield for risk free rate
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 WHERE Date > '${request.params.start}' ORDER BY Date`, (err, rows) => {
      let vals = rows.map(row => Object.values(row).slice(1).reduce((p,c) => p+c, 0))
      axios.post('https://api.portfoliooptimizer.io/v1/portfolio/analysis/ulcer-index', {"portfolios" : [{"portfolioValues":vals}]})
      .then((r) => {
        response.json(r.data['portfolios'][0]['portfolioUlcerIndex'].toFixed(6))})
    })
  })
})

app.post('/valuepiechart', (request, response) => {
  const portfolio = request.body


  let stocks = portfolio[0]["data"].slice(1)
  let all = []
  let cats = []
  const colors = ["#ed6268", "#7aa5e2", "#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]

  let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
      console.error("error", err.message);
    }
    //make sure this is newest, not oldest

    db.get(`SELECT * FROM user123 ORDER BY Date DESC`, function(err, row) {  
      portfolio.forEach((c, q) => {
        if (c.data.length > 1) {
          let prices = c.data.slice(1).map(d => {return {name: d[0], val: row[d[0]]}})
          prices.sort((a, b) => a.val - b.val)
          prices = prices.map((p, i) => {
            const ext = Math.floor(45 * (i + 1) / prices.length + 44)
            return({"name" : p.name, "value" : parseFloat(p.val.toFixed(2)), "fill": ext > 9 ? `${colors[q]}${ext}` : `${colors[q]}0${ext}`})
          })
          all.push(...prices)
          cats.push({"name" : c.title, "value": parseFloat(prices.reduce((sum, cur) => sum + cur.value, 0).toFixed(2)), "fill": `${colors[q]}`})
        }
      })
      let toReturn = {
        "data1" : all,
        "data2" : cats
      }
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
      let pcts = weights.map((w, i) => {
        p = parseFloat((riskContributions[i] / Rtotal).toFixed(4))
        return {"name" : names[i], "value": p * 100, "fill" : `rgb(245, 128, 74, ${p/2 + 0.5})`}
      } )
      
      response.json(pcts)

    })
  })
})


app.post('/tstable', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 ORDER BY Date`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = df.toObject()

      response.json(toReturn)
    })
  })
})

app.get('/returngraph/:start', (request, response) => {
  //do I want to scale relative to average or do pct change?
  //I should make the keys the asset names
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 WHERE Date > '${request.params.start}' ORDER BY Date`, function(err, rows) {
      let names = Object.keys(rows[0]).slice(1)
      let toReturn = []
      rows.forEach(row => {
        let shortdate = convertDateFormat(row.Date)
        let entry = names.reduce((acc, cur) => {
          
          acc[cur] = parseFloat((100 * (row[cur] - rows[0][cur]) / rows[0][cur]).toFixed(2))
          return (acc)
        }, {"date": shortdate})
        toReturn.push(entry)
      })
      response.json(toReturn)
})})})

app.get('/risks', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 ORDER BY Date`, (err, rowZ) => {
      let totalvalue = rowZ.map(row => {
        return Object.values(row).slice(1).reduce((acc,cur) => acc + cur)
      })

      db.all(`SELECT * FROM indices ORDER BY DATE;`, (err, rows) => {
        rows = rows.slice(0,-1) //super hacky, should really do a join on date
        let indices = Array(Object.values(rows[0]).length - 1).fill(0).map(i => new Array)
        rows.map((row) => {
          Object.values(row).slice(1).forEach((v, i) => indices[i].push(v))
        })
        let indexReturns = Array(indices.length).fill(0).map(i => new Array)
        indices.forEach((index, x) => {
          for (let i = 1; i<index.length; i++) {
            indexReturns[x].push(indices[x][i] / indices[x][i-1] - 1)
          }
        })
        let portfolioReturns = []
        for (let i = 1; i<totalvalue.length; i++) {
          portfolioReturns.push(totalvalue[i] / totalvalue[i-1] - 1)
        }
        let portfolioAvg = portfolioReturns.reduce((acc, cur) => acc + cur) / portfolioReturns.length
        let risks = []

        indexReturns.forEach((ir, y) => {

          let avg = ir.reduce((acc, cur) => acc + cur) / ir.length
          let maxcov = ir.map((r, x) => (r - avg)*(portfolioReturns[x] - portfolioAvg)).reduce((acc,cur) => acc + cur) / ir.length
          for (let i = 1; i < 4; i++) {
            let cov = ir.slice(i).map((r, x) => (r - avg)*(portfolioReturns[x] - portfolioAvg)).reduce((acc,cur) => acc + cur) / (ir.length - i)
            if(cov > maxcov) {
              maxcov = cov
            }
            cov = portfolioReturns.slice(i).map((r, x) => (ir[x] - avg)*(r - portfolioAvg)).reduce((acc,cur) => acc + cur) / (portfolioAvg.length - i)
            if(cov > maxcov) {
              maxcov = cov
            }
          }
          
          risks.push({name: Object.keys(rows[0])[y+1], val: Math.abs(maxcov)})
        })
        risks.sort((a,b) => b.val - a.val)
        risks = risks.slice(0,5)
        let high = risks.filter((v) => v.val >= 0.01)
        let moderate = risks.slice(high.length)
        response.json({high: high, moderate: moderate})
      })
    })
  })
})

app.post('/linegraph', (request, response) => {
  //do I want to scale relative to average or do pct change?
  //I should make the keys the asset names
  let db = new sqlite3.Database('asset-values', (err) => {
    db.all(`SELECT * FROM user123 ORDER BY Date`, function(err, rows) {  
      let df = pl.DataFrame(rows)
      let toReturn = []
      let avgs = []
      df.columns.slice(1).forEach((c) => avgs.push(df[c].toArray().reduce((s,c) => s + c) / df[c].length))
      df.rows().forEach((row) => {
        let shortdate = convertDateFormat(row[0])
        row = row.slice(1).map((r, i) => parseFloat((r / avgs[i]).toFixed(2)))
        let entry = df.columns.slice(1).reduce((acc, key, index) => {
          acc[key] = row[index];
          return acc;
        }, {"date":shortdate});

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
          INNER JOIN realEstate ON realEstate.Date = mutualFunds.Date ORDER BY monthlyStock.Date`, function(err, rows) {
  
            
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

                  if (Math.abs(cova) > maxcov) {
                    maxcov = cova
                    lagMatrix[i][n] = -l
                    lagMatrix[n][i] = l
                  }
                  let covb = b.slice(l).reduce((sum, val, indx) => sum + (val - drifts[n]) * (a[indx] - drifts[i]), 0) / (b.length - 1 - l)

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
                  entry[`tot${p}`] = parseFloat(tot.toFixed(2))
                  allprices.push(tot)
                }
                allprices = allprices.sort((a, b) => a - b);
                entry["quantile25"] = quantile(allprices, 0.25)
                entry["quantile75"] = quantile(allprices, 0.75)
                toReturn.push(entry)
              }
              response.json(toReturn)
              return
            }
            console.log("all assets", allassets )
            for (let i = 0; i < numsteps; i++){
              let entry = {"date": i}
              
              for (let n = 0; n < allassets.length; n++){
                for (let p =0; p< numsims; p++) {
                entry[allassets[n]] = parseFloat(simData[n][i][p].toFixed(2))
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
  response.json({"message":"success"})
})

app.post('/deleteuser', (request, response) => {
  let db = new sqlite3.Database('asset-values', (err) => {
    db.run(`DROP TABLE IF EXISTS ${request.body.name}`, (err) => {if (err) {
      console.error(err.message);
  }})
  })
  response.json({"message":"success"})
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
  response.json({"message":"success"})
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
