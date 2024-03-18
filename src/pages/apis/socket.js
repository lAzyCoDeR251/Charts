
let { SmartAPI, WebSocket,WebSocketV2 } = require('smartapi-javascript');

let smart_api = new SmartAPI({
	api_key: 'AloE1oag ', // PROVIDE YOUR API KEY HERE
	// OPTIONAL : If user has valid access token and refresh token then it can be directly passed to the constructor.
	access_token: "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkE4Mjg0NjAiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpCT0RJNE5EWXdJaXdpWlhod0lqb3hOekE0TURnMk56SXhMQ0pwWVhRaU9qRTNNRGM1T0RnNE1qWXNJbXAwYVNJNklqUTNNMkUxTUdJeUxUbGpOakF0TkdJNU15MWlaVEl6TFRka1l6TTJZMkl3WW1Rek1TSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qUXNJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk5Dd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNkltRmxOV1l3TmpabExUbGpaR1V0TXpBM09DMDVOV0kyTFRjek1qQm1ZVEprWkRrek5DiLCJBUEktS0VZIjoiQWxvRTFvYWciLCJpYXQiOjE3MDc5ODg4ODYsImV4cCI6MTcwODA4NjcyMX0.6sALKYxgcxhc7VzvKekcVLVb7KGWAGJYRGW3sBpZ0RkRzBrfmUwLEEZpfYZwFxYzIcD4E0K2uuP0JJ_IRD-Ayg",
	refresh_token: "eyJhbGciOiJIUzUxMiJ9eyJ0b2tlbiI6IlJFRlJFU0gtVE9LRU4iLCJSRUZSRVNILVRPS0VOIjoiZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2lKQk9ESTRORFl3SWl3aVpYaHdJam94TnpBNE1EYzFNamcyTENKcFlYUWlPakUzTURjNU9EZzRNallzSW1wMGFTSTZJakl6TW1ZMllqY3pMV016WlRFdE5EWmlaQzFoTVRVeExURTFORE13WXpZME16a3pZU0lzSW05dGJtVnRZVzVoWjJWeWFXUWlPakFzSW5SdmEyVnVJam9pVWtWR1VrVlRTQzFVVDB0RlRpSXNJblZ6WlhKZmRIbHdaU0k2SW1Oc2FXVnVkQ0lzSW5SdmEyVnVYM1I1Y0dVaU9pSjBjbUZrWlY5eVpXWnlaWE5vWDNSdmEyVnVJaXdpWkdWMmFXTmxYMmxrSWpvaVlXVTFaakEyTm1VdE9XTmtaUzB6TURjNExUazFZall0TnpNeU1HWmhNbVJrT1RNMElpd2lZV04wSWpwN2ZYMC5hV0RGWURiNThXaUpFa3FHUWk4STcyY0lHNUlHLXRBeXFrQWYxb3BJaUdPb0VYYjRtc1hKbE16cmh2Um1xazR0RGFrcmVBUmpKeEp2VmcwQXNHYVdTZyIsImlhdCI6MTcwNzk4ODg4Nn0.oG9si2W8WYU5c4sY2IwctZD_bEk-fHXnCAhbf2IxTTbm7B7zve1Gfx_qxfLOehfxkyDSkcBc9JoT25gUIyWUdw"
});

// If user does not have valid access token and refresh token then use generateSession method
smart_api
	.generateSession('A828460', '0910', '209192')
	.then((data) => {
		return smart_api.generateToken();

        // return smart_api.getProfile();


		// User Methods
		// return smart_api.getProfile()

		// return smart_api.logout()

		// return smart_api.getRMS();

		// Order Methods
		// return smart_api.placeOrder({
		//     "variety": "NORMAL",
		//     "tradingsymbol": "SBIN-EQ",
		//     "symboltoken": "3045",
		//     "transactiontype": "BUY",
		//     "exchange": "NSE",
		//     "ordertype": "LIMIT",
		//     "producttype": "INTRADAY",
		//     "duration": "DAY",
		//     "price": "19500",
		//     "squareoff": "0",
		//     "stoploss": "0",
		//     "quantity": "1"
		// })

		// return smart_api.modifyOrder({
		//     "orderid": "201130000006424",
		//     "variety": "NORMAL",
		//     "tradingsymbol": "SBIN-EQ",
		//     "symboltoken": "3045",
		//     "transactiontype": "BUY",
		//     "exchange": "NSE",
		//     "ordertype": "LIMIT",
		//     "producttype": "INTRADAY",
		//     "duration": "DAY",
		//     "price": "19500",
		//     "squareoff": "0",
		//     "stoploss": "0",
		//     "quantity": "1"
		// });

		// return smart_api.cancelOrder({
		//     "variety": "NORMAL",
		//     "orderid": "201130000006424"
		// });

		// return smart_api.getOrderBook();

		// return smart_api.getTradeBook();

		// Portfolio Methods
		// return smart_api.getHolding();

		// return smart_api.getPosition();

		// return smart_api.convertPosition({
		//     "exchange": "NSE",
		//     "oldproducttype": "DELIVERY",
		//     "newproducttype": "MARGIN",
		//     "tradingsymbol": "SBIN-EQ",
		//     "transactiontype": "BUY",
		//     "quantity": 1,
		//     "type": "DAY"
		// });

		// GTT Methods
		// return smart_api.createRule({
		//    "tradingsymbol" : "SBIN-EQ",
		//    "symboltoken" : "3045",
		//    "exchange" : "NSE",
		//    "producttype" : "MARGIN",
		//    "transactiontype" : "BUY",
		//    "price" : 100000,
		//    "qty" : 10,
		//    "disclosedqty": 10,
		//    "triggerprice" : 200000,
		//    "timeperiod" : 365
		// })
		// return smart_api.modifyRule({
		//             "id" : 1000014,
		//             "symboltoken" : "3045",
		//             "exchange" : "NSE",
		//             "qty" : 10

		// })
		// return smart_api.cancelRule({
		//      "id" : 1000014,
		//      "symboltoken" : "3045",
		//      "exchange" : "NSE"
		// })
		// return smart_api.ruleDetails({
		//     "id" : 25
		// })
		// return smart_api.ruleList({
		//      "status" : ["NEW","CANCELLED"],
		//      "page" : 1,
		//      "count" : 10
		// })

		// Historical Methods
		return smart_api.getCandleData({
		    "exchange": "NSE",
		    "symboltoken": "3045",
		    "interval": "ONE_MINUTE",
		    "fromdate": "2021-02-10 09:00",
		    "todate": "2021-02-10 09:20"
		})
	})
	.then((data) => {
		// Profile details
        console.log(data);
	})
	.catch((ex) => {
		//Log error
        console.log("error");
	});

// TO HANDLE SESSION EXPIRY, USERS CAN PROVIDE A CUSTOM FUNCTION AS PARAMETER TO setSessionExpiryHook METHOD
smart_api.setSessionExpiryHook(customSessionHook);

function customSessionHook() {
	console.log('User loggedout');

	// NEW AUTHENTICATION CAN TAKE PLACE HERE
}

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
// async def upload_image(image: ImageInput):  # Change this to accept an ImageInput
//     print(image.dict())
//     # Decode the Data URL
//     image_data = base64.b64decode(image.image.split(',')[1])

//     # Convert the binary data to a PIL image
//     image = Image.open(io.BytesIO(image_data))

//     # Get the visible data
//     visible_data = image.dict().get('data')

//     # Predict with the model
//     results = model(image, conf=0.40, iou=0.50)

//     bounding_boxes = []  # List to store bounding box coordinates
//     for r in results:
//         im_array = r.plot()  # plot a BGR numpy array of predictions
//         im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image

//         # Get the bounding box coordinates
//         x, y, width, height = r.bbox  # Replace this with your actual code to get the bounding box

//         # Add the coordinates to the list
//         bounding_boxes.append({
//             'x': x,
//             'y': y,
//             'width': width,
//             'height': height,
//         })
        
//         # Save the output image
//         output_path = 'output.png'
//         im.save(output_path)

//         # Return the output image
//         return FileResponse(output_path)

// # Run the FastAPI app with Uvicorn
// if __name__ == "__main__":
//     import uvicorn
//     uvicorn.run(app, host="0.0.0.0", port=8000)
