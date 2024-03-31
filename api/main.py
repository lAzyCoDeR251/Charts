from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from ultralytics import YOLO
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
from io import BytesIO
from typing import List, Dict
import math
from datetime import datetime, timedelta
import pandas as pd   
from sklearn.preprocessing import MinMaxScaler, RobustScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from api.model_functions import calculate_r2, calculate_mape, plot_predictions
from api.LSTM_GRU import StockLSTM
from api.Feature_generator import calculate_indicators
from datetime import datetime, timedelta 
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Initialize the FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Load your YOLO model
#model = YOLO('E:/Final-Year-Project/CNN-Model/CNN model/best.pt')
model = YOLO('api/best.pt')

# Define a request body model for uploading images
class ImageInput(BaseModel):
    image: str  # Change this to str to accept a Data URL
    data: List[Dict]
    fdata: List[Dict] 

#def process_image_upload(allData: ImageInput):
    # Run the LSTM model and get the prediction
    #predicted_stock = load_and_run_model(allData.dict().get('fdata'))
    #return predicted_stock

# Define a route to accept image uploads
@app.post("/api/upload/")
async def upload_image(allData: ImageInput):  # Change this to accept an ImageInput
    scaler_features = RobustScaler()
    scaler_close = RobustScaler()
    input_size = 16  # Number of features
    hidden_size = 64# Number of LSTM units
    num_layers = 2 # Number of LSTM layers
    output_size = 15 
    dropout_prob=0.25

    # Decode the Data URL
    image_data = base64.b64decode(allData.image.split(',')[1])

    # Convert the binary data to a PIL image
    image_pil = Image.open(io.BytesIO(image_data))

    # Get the visible data
    visible_data = allData.dict().get('data')

    # Get the full data
    full_data = allData.dict().get('fdata')
    

    
    # Calculate the cutoff date (most recent 349 days)
    cutoff_date = datetime.now() - timedelta(days=349)

    # Filter the data to include only entries within the last 349 days
    filtered_data = [entry for entry in full_data if datetime.fromisoformat(entry['time']) >= cutoff_date]
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
    
    #print("this is stoock data: ", stock_data)

    updated_stock_data = calculate_indicators(stock_data)
    
    #print("this is stoock data: ", updated_stock_data)


    # Get the size of the image
    width, height = image_pil.size

    # Predict with the model
    results = model(image_pil, conf=0.40, iou=0.50)

    # Convert the time strings to datetime objects
    time_start = datetime.strptime(visible_data[0]['time'], "%Y-%m-%d")
    time_end = datetime.strptime(visible_data[-1]['time'], "%Y-%m-%d")

    # Calculate the time range in days
    time_range = (time_end - time_start).days

    # Get the value range of the data
    value_range = max(d['high'] for d in visible_data) - min(d['low'] for d in visible_data)

    # Create a list to store the bounding box data
    bounding_boxes = []

    # Iterate through the list of detections
    for r in results:
        boxes = r.boxes

        for box in boxes:
            # Bounding box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2) # convert to int values

            # Confidence
            confidence = math.ceil((box.conf[0]*100))/100

            # Calculate the time and value range of the bounding box
            box_time_start = time_start + timedelta(days=x1 / width * time_range)
            box_time_end = time_start + timedelta(days=x2 / width * time_range)
            box_value_start = min(d['low'] for d in visible_data) + (height - y2) / height * value_range
            box_value_end = min(d['low'] for d in visible_data) + (height - y1) / height * value_range

            # Class name
            cls = int(box.cls[0])
            class_name = model.names[cls]

            # Create a dictionary for the bounding box
            bounding_box = {
                "time_start": box_time_start,
                "time_end": box_time_end,
                "value_start": box_value_start,
                "value_end": box_value_end,
                "confidence": confidence,
                "class": class_name
            }

            # Add the bounding box to the list
            bounding_boxes.append(bounding_box)

    # Print the bounding box data
    print({"bounding_boxes": bounding_boxes})

    # Return the bounding box data
    #return {"bounding_boxes": bounding_boxes}

    
    # Process the results and generate output image
    for r in results:
        im_array = r.plot()  # plot a BGR numpy array of predictions
        im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
        
        # Save the output image
        output_path = 'output.png'
        im.save(output_path) 

        # Convert the image to a Base64 string
        buffered = BytesIO()
        im.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()


    # Return the bounding box data and the image URL
    #print({"img": img_str})

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
        lstm_model.load_state_dict(torch.load('api/LSTM_state.pt'))
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
    print("this ispredicted values: ", predicted_stock)

    # Plot actual and predicted values for the current stock
    # Plot actual and predicted values
    plt.figure(figsize=(10, 6))
    plt.plot(updated_stock_data['Close'].values[315:], label='Actual', color='blue')
    plt.plot(predicted_stock, label='Predicted', color='orange')
    plt.title('Actual vs Predicted Stock for Unseen Data')
    plt.xlabel('Time')
    plt.ylabel('Stock Price')
    plt.legend()
    
    # Serialize the plot image to a base64 string
    buffered = BytesIO()
    plt.savefig(buffered, format="png")
    plt.close()
    plot_img_str = base64.b64encode(buffered.getvalue()).decode()

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
    #return sentiment

    return {"bounding_boxes": bounding_boxes, "img": img_str, "predicted_stock": sentiment, "graph": plot_img_str}

# Run the FastAPI app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)