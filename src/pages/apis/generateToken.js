var axios = require('axios');
var data = JSON.stringify({
    "clientcode":"AloE1oag ",
    "password":"0910",
	"totp":"104161"
});

var config = {
  method: 'post',
  url: 'https://apiconnect.angelbroking.com/rest/auth/angelbroking/jwt/v1/generateTokens',

  headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': '192.168.137.1',
    'X-ClientPublicIP': '111.125.221.202',
    'X-MACAddress': '26:5a:04:9a:6b:88',
    'X-PrivateKey': 'YTBKDO28'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});