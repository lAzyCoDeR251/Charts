# lstm_model.py
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import torch
from sklearn.preprocessing import MinMaxScaler
from LSTM_GRU import StockLSTM

def run_lstm_model(fdata):
        # Calculate the cutoff date (most recent 349 days)
    cutoff_date = datetime.now() - timedelta(days=349)

    # Filter the data to include only entries within the last 349 days
    filtered_data = [entry for entry in allData.dict().get('fdata') if datetime.fromisoformat(entry['time']) >= cutoff_date]
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
    # Get the full data
    #full_data = allData.dict().get('fdata')

    # Generate Excel file from full data
    #df = pd.DataFrame(full_data)
    #excel_file_path = 'full_data.xlsx'
    #df.to_excel(excel_file_path, index=False)

    # Add your additional processing here
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
    
    # Load the model
    #model = torch.load(model_path) 
    #lstm_model = torch.load('E:/Final-Year-Project/UI/my-app/src/pages/apis/Rolling_NSE502_1Y.pt')
    lstm_model = torch.load('Rolling_NSE502_1Y.pt')

    # Ensure the model is in evaluation mode
    lstm_model.eval()
    # Predictions
    y_pred = lstm_model(X_tensor)
    # Apply inverse transformation to the predicted data
    y_pred_2d = y_pred.view(y_pred.shape[1], -1)
    predicted_stock = scaler_close.inverse_transform(y_pred_2d.detach().numpy())
    
    # Determine the sentiment based on predicted values
    def get_sentiment(predicted_values):
        if predicted_values[-1][0] > predicted_values[0][0]:
            return "Bullish sentiment"
        elif predicted_values[-1][0] < predicted_values[0][0]:
            return "Bearish sentiment"
        else:
            return "Consolidation"

    sentiment = get_sentiment(predicted_stock)
    print(sentiment)
    return sentiment