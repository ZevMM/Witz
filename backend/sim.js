const math = require('mathjs');
const randomNormal = require('random-normal');

function main(mu, sigma, num_simulations, num_stocks, num_time_steps, starts, corr, numevents, events, lagMatrix) {


    const dt = 1;  // Time step size


    function choleskyDecomposition(matrix) {
        const n = matrix.length;
        const L = [];
    
        for (let i = 0; i < n; i++) {
        L[i] = new Array(n).fill(0);
        }
    
        for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            let sum = 0;
            if (j === i) {
            for (let k = 0; k < j; k++) {
                sum += Math.pow(L[j][k], 2);
            }
            L[j][j] = Math.sqrt(matrix[j][j] - sum);
            } else {
            for (let k = 0; k < j; k++) {
                sum += L[i][k] * L[j][k];
            }
            L[i][j] = (matrix[i][j] - sum) / L[j][j];
            }
        }
        }
    
        return ((math.matrix(L)));
    }

    // Cholesky decomposition to generate correlated random numbers
    const L = choleskyDecomposition(corr);  // Cholesky decomposition
    console.log(L)
    // Generate random numbers


    // Initialize arrays for stock prices
    let prices = math.zeros(num_stocks, num_time_steps, num_simulations);
    for (let i = 0; i < num_stocks; i++) {
        prices._data[i][0].fill(starts[i + numevents]);  // Initial prices for all stocks
    }
    prices = prices._data

    //[30, 40, 5]
    // Simulate GBM

    for (let n = 0; n < num_simulations; n++) {
        let rand = Array(num_stocks + numevents).fill(0).map(a => Array(num_time_steps + 6).fill(0).map(e => randomNormal()))
        for (let t = 1; t< num_time_steps; t++) {
            if (events[String(t)]){
                for (const [k, v] of Object.entries(events[String(t)])) {
                    rand[parseInt(k)][t+3] = v / L._data[parseInt(k)][parseInt(k)]
                }
            }
        }
        
        for (let t = 1; t < num_time_steps; t++) {

            let dW = []
            
            lagMatrix.forEach((l, ix) => {
                let other = l.map((x,i) => rand[i][t + 3 - x])
                let self = L._data[ix]
                
                let matrixmul = other.reduce((sum, cur, idx) => self[idx] * cur + sum, 0)

                dW.push(matrixmul)
                
            })

            

            // Compute stock prices using GBM formula
            for (let s = 0; s < num_stocks; s++) {
                
                let drift = mu[s + numevents] * prices[s][t - 1][n]            
                let diffusion = sigma[s + numevents] * prices[s][t - 1][n] * dW[s + numevents] * 15
                
                newprice = prices[s][t - 1][n] + drift * dt + diffusion
                if (newprice > 0) {
                    prices[s][t][n] = newprice
                } else {
                    prices[s][t][n] = prices[s][t-1] / 10
                }
                
            }

        }
    }

    return prices
}

module.exports = {
    GBM: main
}
