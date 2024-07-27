const math = require('mathjs');
const randomNormal = require('random-normal');

function main(mu, sigma, num_simulations, num_stocks, num_time_steps, starts, corr, numevents, events) {


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
    
        return math.matrix(L);
    }

    // Cholesky decomposition to generate correlated random numbers
    const L = math.matrix(choleskyDecomposition(corr));  // Cholesky decomposition
    // Generate random numbers


    // Initialize arrays for stock prices
    let prices = math.zeros(num_stocks, num_time_steps, num_simulations);
    for (let i = 0; i < num_stocks; i++) {
        prices._data[i][0].fill(starts[i]);  // Initial prices for all stocks
    }
    prices = prices._data

    //[30, 40, 5]
    // Simulate GBM
    for (let n = 0; n < num_simulations; n++) {
        for (let t = 1; t < num_time_steps; t++) {
            let rand = Array(num_stocks + numevents).fill(0);
            rand = math.matrix(rand.map(e => randomNormal()))
            if (events[String(t)]){
                for (const [k, v] of Object.entries(events[String(t)])) {
                    rand._data[parseInt(k)] = v
                }
            }
            // Generate correlated increments
            let dW = math.multiply(L, rand);
            dW = math.multiply(dW, math.sqrt(dt));

            // Compute stock prices using GBM formula
            for (let s = 0; s < num_stocks; s++) {
                let drift = mu[s] * prices[s][t-1][n]            
                let diffusion = sigma[s] * prices[s][t-1][n] * dW._data[s]
                prices[s][t][n] = prices[s][t-1][n] + drift * dt + diffusion
            }
        }
    }

    return prices
}

module.exports = {
    GBM: main
}