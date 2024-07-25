const math = require('mathjs');

//This is actually less efficient, even for high numbers of simulations. 

// Parameters
const num_stocks = 3;  // Number of stocks
const num_simulations = 500;  // Number of simulations
const num_time_steps = 100;  // Number of time steps
const dt = 0.01;  // Time step size

// Drift and volatility coefficients for each stock
const mu = [0.1, 0.05, 0.03];
const sigma = [0.2, 0.15, 0.1];

// Correlation matrix (assume same correlation between each pair)
const corr = [
    [1.0, 0.6, 0.4],
    [0.6, 1.0, 0.6],
    [0.4, 0.6, 1.0]
];


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

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num <= 0) return randn_bm() // resample between 0 and 1
    return num
}

// Cholesky decomposition to generate correlated random numbers
const L = choleskyDecomposition(corr);



// Initialize arrays for stock prices
let prices = math.zeros(num_stocks, num_time_steps, num_simulations);
for (let i = 0; i < num_stocks; i++) {
    prices._data[i][0].fill(100.0);  // Initial prices for all stocks
}

// Simulate GBM
for (let t = 1; t < num_time_steps; t++) {
    // Generate random numbers
    let rand = math.zeros(num_stocks, num_simulations);
    for (let i = 0; i < num_stocks; i++) {
        for (let k = 0; k < num_simulations; k++) {
            rand._data[i][k] = randn_bm();
        }
    }

    let dW = math.multiply(L, rand);
    dW = math.multiply(dW, math.sqrt(dt));

    // Compute stock prices using GBM formula
    for (let s = 0; s < num_stocks; s++) {
        let drift = math.multiply(mu[s], math.subset(prices, math.index(s, t - 1, math.range(0, num_simulations))));
        let diffusion = math.dotMultiply(math.multiply(sigma[s], math.subset(prices, math.index(s, t - 1, math.range(0, num_simulations)))), math.subset(dW, math.index(s, math.range(0, num_simulations))));
        prices.subset(math.index(s, t, math.range(0, num_simulations)), math.add(math.subset(prices, math.index(s, t - 1, math.range(0, num_simulations))), math.add(math.multiply(drift, dt), diffusion)))
    }
}

console.log(prices._data);