from sklearn.preprocessing import MinMaxScaler, RobustScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from model_functions import calculate_r2, calculate_mape, plot_predictions
from LSTM_GRU import StockLSTM
from Feature_generator import calculate_indicators
from datetime import datetime, timedelta
import torch
import torch.nn as nn
import numpy as np
import pandas as pd

def load_and_run_model(data):
    scaler_features = RobustScaler()
    scaler_close = RobustScaler()
    input_size = 16  # Number of features
    hidden_size = 64# Number of LSTM units
    num_layers = 2 # Number of LSTM layers
    output_size = 15 
    dropout_prob=0.25

    
        # Calculate the cutoff date (most recent 349 days)
    cutoff_date = datetime.now() - timedelta(days=349)

    # Filter the data to include only entries within the last 349 days
    filtered_data = [entry for entry in data if datetime.fromisoformat(entry['time']) >= cutoff_date]
    #print(filtered_data)

    # Convert filtered_data to DataFrame
    stock_data = pd.DataFrame({
        'Timestamp': pd.to_datetime([entry['time'] for entry in filtered_data]),
        'Open': [entry['open'] for entry in filtered_data],
        'High': [entry['high'] for entry in filtered_data],
        'Low': [entry['low'] for entry in filtered_data],
        'Close': [entry['close'] for entry in filtered_data],
        'Volume': [entry['volume'] for entry in filtered_data],
        'Adj_Close': [entry['adj_close'] for entry in filtered_data]
    })
    
    print(stock_data)

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

    try:
        print("Loading model...")
        lstm_model = StockLSTM(input_size, hidden_size, num_layers, output_size, dropout_prob)
        lstm_model.load_state_dict(torch.load('LSTM_state.pt'))
        print("Model loaded successfully.")
    except Exception as e:
        print("Error loading model:", e)
        # Log the error for further analysis
        raise e
    
    # Ensure the model is in evaluation mode
    lstm_model.eval()
    # Predictions
    y_pred = lstm_model(X_tensor)
    # Apply inverse transformation to the predicted data
    y_pred_2d = y_pred.view(y_pred.shape[1], -1)
    predicted_stock = scaler_close.inverse_transform(y_pred_2d.detach().numpy())
    print(predicted_stock)

    return predicted_stock