import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset, TensorDataset
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import torch.nn.functional as F

def calculate_r2(actual, predicted):
    # Calculate sum of squared residuals
    ss_residual = np.sum((actual - predicted)**2)

    # Calculate total sum of squares
    ss_total = np.sum((actual - np.mean(actual))**2)

    # Calculate R-squared
    r2 = 1 - (ss_residual / ss_total)

    return r2

def calculate_mape(actual, predicted):
    # Calculate absolute percentage error
    ape = np.abs((actual - predicted) / actual) * 100

    # Calculate mean absolute percentage error
    mape = np.mean(ape)

    return mape
def plot_predictions(actual, predicted, title):
    plt.figure(figsize=(10, 6))
    plt.plot(actual, label='Actual')
    plt.plot(predicted, label='Predicted')
    plt.xlabel("Days")
    plt.ylabel("Price")
    plt.title(title)
    #plt.legend()
    plt.grid(True)
    plt.show()
    
class StockDataset(Dataset):
    def __init__(self, csv_file):
        self.data = pd.read_csv(csv_file)
        self.stocks = self.data['Stock'].unique()

    def __len__(self):
        return len(self.stocks)

    def __getitem__(self, idx):
        stock = self.stocks[idx]
        stock_data = self.data[self.data['Stock'] == stock]

        # Preprocess your data here, e.g., normalization, and convert it to tensors
        stock_data = stock_data.drop(columns=['Date', 'Volume', 'Stock', 'Log Return', 'ROC', 'DI_pos',
                                               'RSI', 'OBV'])
        X = stock_data[:-15].drop(columns=['Close'])
        Y = stock_data[-15:]['Close']
        #Y = Y.values.reshape(-1, 1)
        # Convert the data to tensors
        X_tensor = torch.tensor(X.values.astype(np.float32))
        Y_tensor = torch.tensor(Y.values.astype(np.float32)).reshape(-1, 1)

        return X_tensor, Y_tensor