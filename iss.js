const request = require('request');


const fetchMyIP = function(callback) { 
  const url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {
    // if error, 
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all is well and we got the data
    const data = JSON.parse(body);
    if (data.ip.length !== 0) {
      let ip = data.ip;
      callback(null, ip);
    }
  });
};


const fetchCoordsByIP = function(ip, callback) {
  const apiKey = "4c88d520-a65e-11ec-928b-21b9682715c9" 
  const fullUrl = "https://api.freegeoip.app/json/" + ip + "?apikey=" + apiKey;

  request(fullUrl, (error, response, body) => {
    // if error
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all is well and we got the data
    const data = JSON.parse(body);
    let latCoord = data.latitude;
    let longCoord = data.longitude;
    let latLongObj = {
      latitude: latCoord,
      longitude: longCoord
    };
    // pass data to callback
    callback(null, latLongObj);
  });
};


const fetchISSFlyOverTimes = function(latLongObj, callback) {
  const fullUrl = "https://iss-pass.herokuapp.com/json/?lat=" + latLongObj.latitude + "&lon=" + latLongObj.longitude;
  request(fullUrl, (error, response, body) => {
    // if error
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all is well and we got the data
    const data = JSON.parse(body).response;
    callback(null, data);
  });
};


const nextIssTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, latLongObj) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(latLongObj, (error, passTimes) => {
        if (error) {
          callback(error, null);
          return;
        }
          callback(null, passTimes);
        })
      }) 
  });
};


module.exports = { nextIssTimesForMyLocation };