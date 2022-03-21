const res = require('express/lib/response');
const request = require('request-promise-native');


const fetchMyIP = function() { 
  return request('https://api.ipify.org?format=json') 
}

const fetchCoordsByIP = function(body) {
  
  const ip = JSON.parse(body).ip;
  
  const apiKey = "4c88d520-a65e-11ec-928b-21b9682715c9" 
  const fullUrl = "https://api.freegeoip.app/json/" + ip + "?apikey=" + apiKey;
  return request(fullUrl);
}

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude} = JSON.parse(body);
  const fullUrl = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(fullUrl);
}



const nextIssTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
    const { response } = JSON.parse(data);
    return response;
    });
};




module.exports = { nextIssTimesForMyLocation };
