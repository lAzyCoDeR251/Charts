import requests
import pandas as pd
from datetime import datetime
import torch
import torch.nn as nn
import numpy as np
from sklearn.preprocessing import MinMaxScaler, RobustScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from model_functions import calculate_r2, calculate_mape, plot_predictions
from LSTM_GRU import StockLSTM
from Feature_generator import calculate_indicators

scaler_features = RobustScaler()
scaler_close = RobustScaler()

url = "https://yahoo-finance127.p.rapidapi.com/historic/TCS.NS/1d/349d"

headers = {
"X-RapidAPI-Key": "cdde86557dmshb197b6279d8a004p1b2b14jsn3cf4159737ac",
"X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com"
}

response = requests.get(url, headers=headers)

#print(response.json())
data = response.json()
# Extracting data from the JSON response
art = [datetime.utcfromtimestamp(time).strftime('%Y-%m-%d') for time in data['timestamp']]

#print(timestamp)#need hour, sec,add(%H:%M:%S)
quote_data = data['indicators']['quote'][0]
adj_close_data = data['indicators']['adjclose'][0]

# Creating DataFrame
stock_data = pd.DataFrame({
    'Timestamp': art,  # Repeat timestamp for each record
    'Open': quote_data['open'],
    'Close': quote_data['close'],
    'High': quote_data['high'],
    'Low': quote_data['low'],
    'Volume': quote_data['volume'],
    'Adj_Close': adj_close_data['adjclose']
})
# for stock in unseen_data['Stock'].unique():
#     stock_data = unseen_data[unseen_data['Stock'] == stock]
updated_stock_data = calculate_indicators(stock_data)


scaler_features.fit(updated_stock_data.drop(columns=['Timestamp', 'Close', 'Volume', 'ROC', 'DI_pos',
                                           'RSI', 'OBV']))
scaler_close.fit(updated_stock_data['Close'].values.reshape(-1, 1))

# Preprocess the data
X_test = scaler_features.transform(updated_stock_data.drop(columns=['Timestamp', 'Close', 'Volume', 'ROC', 'DI_pos',
                                           'RSI', 'OBV']))[:315]
Y_test = scaler_close.transform(updated_stock_data['Close'].values.reshape(-1, 1))[315:]

# Process the tensors
X_tensor = torch.tensor(X_test.astype(np.float32)).unsqueeze(0)
Y_tensor = torch.tensor(Y_test.astype(np.float32))
model = torch.load('Rolling_NSE502_1Y.pt')

# Ensure the model is in evaluation mode
model.eval()
# Predictions
y_pred = model(X_tensor)
# Apply inverse transformation to the predicted data
y_pred_2d = y_pred.view(y_pred.shape[1], -1)
predicted_stock = scaler_close.inverse_transform(y_pred_2d.detach().numpy())
print(predicted_stock)
# Plot actual and predicted values for the current stock
plot_predictions(updated_stock_data['Close'].values[315:], predicted_stock, f'Actual vs Predicted Stock  for Unseen Data')


