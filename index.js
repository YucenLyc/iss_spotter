const { fetchMyIP } = require("./iss");
const { fetchCoordsByIP } = require("./iss");
const { fetchISSFlyOverTimes } = require("./iss");
const { nextISSTimesForMyLocation } = require("./iss");

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP:", ip);

  fetchCoordsByIP(ip, (error, coord) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log("It worked! Returned coordinates:", coord);

    const sampleCoord = { latitude: "", longitude: "" };

    fetchISSFlyOverTimes(sampleCoord, (error, passTimes) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      console.log("It worked! Returned response:", passTimes);

      const printPassTime = function(passTimes){
        for (const pass of passTimes) {
          const datetime = new Date(0);
          datetime.setUTCSecondds(pass.risetime);
          const duration = pass.duration;
          console.log(`Next pass at ${duration} for ${duration} seconds!`);
        }
      }

      nextISSTimesForMyLocation((error, passTimes) => {
        if (error) {
          return console.log("It didn't work!", error);
        }
        printPassTime(passTimes);
      });
    });
  });
});
