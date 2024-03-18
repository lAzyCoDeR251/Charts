let WebSocketV2 = require('smartapi-javascript').WebSocketV2;

// Create an instance of WebSocketV2 with required parameters
let web_socket = new WebSocketV2({
    jwttoken: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkE4Mjg0NjAiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpCT0RJNE5EWXdJaXdpWlhod0lqb3hOekE0TURnek5USTJMQ0pwWVhRaU9qRTNNRGM1T0RRNU9EVXNJbXAwYVNJNklqVTVZbVEwTmpFNUxUWTROMlV0TkRjNE5pMDVaRFF4TFRKa016SXhaREJqTmpVNU1DSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qUXNJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk5Dd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNklqWXlaVFkyTm1NMExUZzFZVE10TXpJM01pMWhZVEJqTFRWaU1UTXlZMk16WmpBNVppSXNJbUZqZENJNmUzMTkudExkaEFsSzhsNFZ2OVpRR01yb1NkTmhzZEhzZ19jTVhZQ3RueWtfbTl1cFhWMXREUHlSdGpxLU96RlNoU0VJZGczdW5SNUc2YU1NVjdiRnVYSmV3RHciLCJBUEktS0VZIjoiM3I4ZjYyY2MiLCJpYXQiOjE3MDc5ODUwNDUsImV4cCI6MTcwODA4MzUyNn0.KfhyuwDX-H3Z8cgvfYt9PGpYLMa-6b0hnyNR-xSSHJ3RX8AAZXV1toNBUdurHI4LFqOk0U4-TCynu7JddVvqEA',
    apikey: 'atdnztsF',
    clientcode: 'A828460',
    feedtype: 'FEED_TYPE',
});

// Connect to the WebSocket server
web_socket.connect().then((res) => {
    // Define the request to fetch market data
    let json_req = {
        correlationID: 'abcde12345',
        action: 1,
        params: {
            mode: 4, // This is the mode for fetching market data
            tokenList: [
                {
                    exchangeType: 1, // Exchange type (1 for NSE, for example)
                    tokens: ['1232'], // Array of token(s) for the instrument(s) you want data for
                },
            ],
        },
    };

    // Send the request to fetch market data
    web_socket.fetchData(json_req);

    // Handle the received market data
    web_socket.on('tick', receiveTick);

    function receiveTick(data) {
        console.log('Received market data:', data);
        // Process the received market data as needed
    }
}).catch((error) => {
    console.error('WebSocket connection error:', error);
});


// from fastapi import FastAPI, File, UploadFile, HTTPException
// from fastapi.responses import FileResponse
// from pydantic import BaseModel
// from typing import List
// from ultralytics import YOLO
// from PIL import Image
// from fastapi.middleware.cors import CORSMiddleware
// import base64
// import io
// from typing import List, Dict
// import math
// from datetime import datetime

// # Initialize the FastAPI app
// app = FastAPI()

// app.add_middleware(
//     CORSMiddleware,
//     allow_origins=["http://localhost:3000"],
//     allow_credentials=True,
//     allow_methods=["GET", "POST"],
//     allow_headers=["*"],
// )

// # Load your YOLO model
// model = YOLO('E:/Final-Year-Project/CNN-Model/CNN model/best.pt')

// # Define a request body model for uploading images
// class ImageInput(BaseModel):
//     image: str  # Change this to str to accept a Data URL
//     data: List[Dict]

// # Define a route to accept image uploads
// @app.post("/api/upload/")
// async def upload_image(allData: ImageInput):  # Change this to accept an ImageInput
//     # Decode the Data URL
//     image_data = base64.b64decode(allData.image.split(',')[1])

//     # Convert the binary data to a PIL image
//     image_pil = Image.open(io.BytesIO(image_data))

//     # Get the visible data
//     visible_data = allData.dict().get('data')

//     # Get the size of the image
//     width, height = image_pil.size

//     # Predict with the model
//     results = model(image_pil, conf=0.40, iou=0.50)
//     #print(results);

//     # Convert the time strings to datetime objects
//     time_start = datetime.strptime(visible_data[0]['time'], "%Y-%m-%d")
//     time_end = datetime.strptime(visible_data[-1]['time'], "%Y-%m-%d")

//     # Calculate the time range in days
//     time_range = (time_end - time_start).days

//     # Get the time range and value range of the data
//     #time_range = visible_data[-1]['time'] - visible_data[0]['time']
//     value_range = max(d['high'] for d in visible_data) - min(d['low'] for d in visible_data)

//         # Create a list to store the bounding box data
//     bounding_boxes = []

//     # Iterate through the list of detections
//     for r in results:
//         boxes = r.boxes

//         for box in boxes:
//             # Bounding box
//             x1, y1, x2, y2 = box.xyxy[0]
//             x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2) # convert to int values

//             # Confidence
//             confidence = math.ceil((box.conf[0]*100))/100

//             # Calculate the time and value range of the bounding box
//             time_start = visible_data[0]['time'] + x1 / width * time_range
//             time_end = visible_data[0]['time'] + x2 / width * time_range
//             value_start = min(d['low'] for d in visible_data) + (height - y2) / height * value_range
//             value_end = min(d['low'] for d in visible_data) + (height - y1) / height * value_range

//             # Confidence
//             confidence = math.ceil((box.conf[0]*100))/100

//             # Class name
//             cls = int(box.cls[0])
//             class_name = model.names[cls]

//             # Create a dictionary for the bounding box
//             bounding_box1 = {
//                 "x1": x1,
//                 "y1": y1,
//                 "x2": x2,
//                 "y2": y2,
//                 "confidence": confidence,
//                 "class": class_name
//             }
//             bounding_box = {
//                 "time_start": time_start,
//                 "time_end": time_end,
//                 "value_start": value_start,
//                 "value_end": value_end,
//                 "confidence": confidence,
//                 "class": class_name
//             }

//             # Add the bounding box to the list
//             bounding_boxes.append(bounding_box)

//     # Print the bounding box data
//     print({"bounding_boxes": bounding_boxes})

//     # Return the bounding box data
//     return {"bounding_boxes": bounding_boxes}


    
//     # Process the results and generate output image
//     for r in results:
//         im_array = r.plot()  # plot a BGR numpy array of predictions
//         im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
        
//         # Save the output image
//         output_path = 'output.png'
//         im.save(output_path)

//         # Return the output image
//         return FileResponse(output_path)

// # Run the FastAPI app with Uvicorn
// if __name__ == "__main__":
//     import uvicorn
//     uvicorn.run(app, host="0.0.0.0", port=8000)
