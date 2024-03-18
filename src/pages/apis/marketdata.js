const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://yahoo-finance127.p.rapidapi.com/historic/tcs.ns/1d/max',
  headers: {
    'X-RapidAPI-Key': '2c1d93c14dmshcabf7c3bc305e7fp1ba0b4jsn3b1d3df0e4ed',
    'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();

// var axios = require('axios');
// var data = JSON.stringify({
//     "mode": "FULL",
//     "exchangeTokens": {
//         "NSE": ["3045"]
//     }
// });

// var config = {
//   method: 'post',
//   url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/',
//   headers: { 
//     'X-PrivateKey': 'A828460', 
//     'Accept': 'application/json, application/json', 
//     'X-SourceID': 'WEB, WEB', 
//     'X-UserType': 'USER', 
//     'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkE4Mjg0NjAiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpCT0RJNE5EWXdJaXdpWlhod0lqb3hOekE0TURnMk56SXhMQ0pwWVhRaU9qRTNNRGM1T0RnNE1qWXNJbXAwYVNJNklqUTNNMkUxTUdJeUxUbGpOakF0TkdJNU15MWlaVEl6TFRka1l6TTJZMkl3WW1Rek1TSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qUXNJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk5Dd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNkltRmxOV1l3TmpabExUbGpaR1V0TXpBM09DMDVOV0kyTFRjek1qQm1ZVEprWkRrek5DSXNJbUZqZENJNmUzMTkueEZVblJHMWwweXRxOG4zVlhFeHBucHhvUzhXVE8yVnRDUWpLN25rcFlwaGlXemYtTHlQd2ZhY2dlcDBfTTBkU1NIajZMSXMzRXZxMmpVMENHc0tmMVEiLCJBUEktS0VZIjoiQWxvRTFvYWciLCJpYXQiOjE3MDc5ODg4ODYsImV4cCI6MTcwODA4NjcyMX0.6sALKYxgcxhc7VzvKekcVLVb7KGWAGJYRGW3sBpZ0RkRzBrfmUwLEEZpfYZwFxYzIcD4E0K2uuP0JJ_IRD-Ayg', 
//     'Content-Type': 'application/json'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });


// const { SmartAPI } = require('smartapi-javascript');

// const smartApi = new SmartAPI({
//     api_key: 'AloE1oag', // Replace 'smartapi_key' with your actual API key
// });

// const request = {
//     generatingSession: {
//         client_code: "A828460",
//         password: "1234",
//         totp: "122234"
//     },
//     marketData: {
//         "mode": "FULL",
//         "exchangeTokens": {
//             "NSE": [
//                 "3045"
//             ]
//         }
//     },
// };

// smartApi.generateSession(request.generatingSession.client_code, request.generatingSession.password, request.generatingSession.totp)
//     .then(() => smartApi.getProfile())
//     .then((data) => {
//         console.log(data); // Handle the market data response here
//     })
//     .catch((error) => {
//         console.error(error); // Handle any errors during session generation or market data retrieval
//     });
  