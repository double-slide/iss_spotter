const { nextIssTimesForMyLocation } = require('./iss');

nextIssTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
  }

  for (let element in passTimes) {
    let unix_time = passTimes[element].risetime;
    let date = new Date(unix_time * 1000);
    let durationSeconds = passTimes[element].duration;

    console.log(`Next pass at ${date} for ${durationSeconds} seconds`)
  }
});