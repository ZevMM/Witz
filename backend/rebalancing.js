
function main(prices, numsims, initvals, timesteps) {
    toReturn = Array(initvals.length).fill(0).map(_ => Array(timesteps).fill(0).map(t => Array(numsims).fill(0)))
    let init_total = initvals.reduce((sum, cur) => sum + cur)
    let weights = initvals.map(v => v / init_total)
    for (let n = 0; n < numsims; n++) {
        let shares = [initvals.map((v,i) => v / prices[i][0][n])]
        for (let t = 1; t < timesteps; t++) {
            let newtotal = shares[t - 1].map((s, i) => s * prices[i][t][n])
            newtotal = newtotal.reduce((s,c) => s + c)
            shares.push(weights.map((w,i) => prices[i][t][n] > 0.0001 ? w * newtotal / prices[i][t][n] : 0))
        }
        shares.forEach((s, x) => {
            s.forEach((p,y) => {
                toReturn[y][x][n] = p * prices[y][x][n]
            })
        })
    }
    return toReturn
}

function lever(prices, initvals, numsims, timesteps, levs) {
    let returns = Array(prices.length).fill(0).map(p => Array(timesteps - 1).fill(0).map(t => Array(numsims).fill(0)))
    for (let n = 0; n< numsims; n++) {
        for (let i = 1; i < timesteps; i++) {
            prices.forEach((s, x) => {
                returns[x][i - 1][n] = s[i][n] / s[i-1][n] - 1
            })
        }
    }
    for (let n = 0; n< numsims; n++) {
        for (let i = 1; i < timesteps; i++) {
            returns.forEach((s, x) => {
                let newprice = prices[x][i - 1][n] * returns[x][i - 1][n] * levs[x]
                if (newprice < 0) {
                    newprice = 0
                }
                prices[x][i][n] = newprice
            })
        }
    }
    return prices
}

function weight(prices, initvals) {
    let shares = initvals.map((v,i) => v / prices[i][0][0])
    prices = prices.map((s, i) => {
        return s.map((n, x) => {
           return n.map((p, o) => p * shares[i])
        })
    })
    return prices
}


module.exports = {
    rebalance: main,
    lever: lever,
    weight: weight
}