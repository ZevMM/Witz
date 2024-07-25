import numpy as np
import matplotlib.pyplot as plt


#Rather than keeping the correlation between all stocks constant, it might be easier to just keep them all consistent with the market.
#Just sim the market to start, then do some random sims for each stock and add them together weighted.
#No, this way is better. e.g. it'll keep tech stocks together. Just ensure it's not too computationally intensive

# Parameters
num_stocks = 3  # Number of stocks
num_simulations = 2  # Number of simulations
num_time_steps = 100  # Number of time steps
dt = 0.01  # Time step size
mu = np.array([0.1, 0.05, 0.03])  # Drift coefficients for each stock
sigma = np.array([0.2, 0.15, 0.1])  # Volatility coefficients for each stock

# Correlation matrix (assume same correlation between each pair)
corr = np.array([
    [1.0, 0.6, 0.4],
    [0.6, 1.0, 0.6],
    [0.4, 0.6, 1.0]
])

# Cholesky decomposition to generate correlated random numbers
L = np.linalg.cholesky(corr)
print(L)

# Generate random numbers
rand = np.random.normal(0, 1, (num_stocks, num_time_steps, num_simulations))

# Initialize arrays for stock prices
prices = np.zeros((num_stocks, num_time_steps, num_simulations))
prices[:, 0, :] = 100.0  # Initial prices for all stocks

# Simulate GBM
for t in range(1, num_time_steps):
    # Generate correlated increments
    dW = np.matmul(L, rand[:, t, :]) * np.sqrt(dt)
    print(rand[:, t, :])
    
    # Compute stock prices using GBM formula
    for s in range(num_stocks):
        drift = mu[s] * prices[s, t - 1, :]
        diffusion = sigma[s] * prices[s, t - 1, :] * dW[s, :]
        prices[s, t, :] = prices[s, t - 1, :] + drift * dt + diffusion

# Plotting
for sim in range(num_simulations):
    plt.figure(figsize=(8, 4))
    for s in range(num_stocks):
        plt.plot(prices[s, :, sim], label=f'Stock {s+1}')
    plt.title(f'Simulation Path {sim+1}')
    plt.xlabel('Time Steps')
    plt.ylabel('Price')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()