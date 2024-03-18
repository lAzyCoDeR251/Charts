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
model = YOLO('E:/Final-Year-Project/CNN-Model/CNN model/best.pt')

# Define a request body model for uploading images
class ImageInput(BaseModel):
    image: str  # Change this to str to accept a Data URL
    data: List[Dict]
    fdata: List[Dict] 

# Define a route to accept image uploads
@app.post("/api/upload/")
async def upload_image(allData: ImageInput):  # Change this to accept an ImageInput
    # Decode the Data URL
    image_data = base64.b64decode(allData.image.split(',')[1])

    # Convert the binary data to a PIL image
    image_pil = Image.open(io.BytesIO(image_data))

    # Get the visible data
    visible_data = allData.dict().get('data')

    # Get the full data
    full_data = allData.dict().get('fdata')

    # Generate Excel file from full data
    df = pd.DataFrame(full_data)
    excel_file_path = 'full_data.xlsx'
    df.to_excel(excel_file_path, index=False)

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
    print({"img": img_str})
    return {"bounding_boxes": bounding_boxes, "img": img_str}

# Run the FastAPI app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
