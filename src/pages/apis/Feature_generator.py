# stock_analysis.py

import pandas as pd
import talib as ta
import numpy as np
from datetime import datetime

def calculate_rsi(prices, window=14):
    rsi = ta.RSI(prices.fillna(np.nan).to_numpy(), timeperiod=window)
    return pd.Series(rsi, index=prices.index)

def calculate_indicators(df):
    # Calculate EMA, MACD, and RSI for the stock
    df['EMA12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA26'] = df['Close'].ewm(span=26, adjust=False).mean()
    df['EMA50'] = df['Close'].ewm(span=50, adjust=False).mean()
    df['ATR'] = ta.ATR(df['High'], df['Low'], df['Close'], timeperiod=14)
    df['ROC'] = ta.ROC(df['Close'], timeperiod=12)
    df['MACD'] = df['EMA12'] - df['EMA26']
    df['RSI'] = calculate_rsi(df['Close'])
    bb_upper, _, bb_lower = ta.BBANDS(df['Close'], timeperiod=20, nbdevup=2, nbdevdn=2, matype=0)
    df['BB_upper'] = bb_upper
    df['BB_lower'] = bb_lower  # Rate of Change
    df['DI_pos'] = ta.PLUS_DI(df['High'], df['Low'], df['Close'], timeperiod=14)
    df['SMA'] = ta.SMA(df['Close'], timeperiod=20)  # Simple Moving Average
    df['TSF'] = ta.TSF(df['Close'], timeperiod=14)  # Time Series Forecast
    df['WCP'] = (df['High'] + df['Low'] + df['Close']) / 3  # Weighted Close Price
    df['WMA'] = ta.WMA(df['Close'], timeperiod=20)  # Weighted Moving Average
    df['SAR'] = ta.SAR(df['High'], df['Low'], acceleration=0.02, maximum=0.2)  # Parabolic SAR
    df['OBV'] = ta.OBV(df['Close'], df['Volume'])  # On-Balance Volume
    df.dropna(axis=0, inplace=True)
    
    return df
