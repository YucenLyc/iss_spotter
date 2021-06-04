// **
//  * Makes a single API request to retrieve the user's IP address.
//  * Input:
//  *   - A callback (to pass back an error or the IP string)
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The IP address as a string (null if error). Example: "162.245.144.188"
//  */
const request = require("request");

const fetchMyIP = function (callback) {
  request(
    "https://api.ipify.org?format=json",
    function (error, response, body) {
      // pass through error to callback if error
      if (error) {
        callback(error, null);
      }

      // const data = JSON.parse(body);
      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching IP. Response: ${body}`
          ),
          null
        );
        return;
      } else {
        callback(null, JSON.parse(body).ip);
      }
    }
  );
};
//fetchMyIP();

const fetchCoordsByIP = function (ip, callback) {
  request(
    `https://freegeoip.app/json/${ip}`, //how to pass the ip value from fetchMyIP to fetchCoordsByIP
    function (error, response, body) {
      if (error) {
        callback(error, null);
      }

      // const data = JSON.parse(body);
      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`
          ),
          null
        );
        return;
      }

      let APIRes = JSON.parse(body);

      let res = {
        latitude: APIRes.latitude,
        longitude: APIRes.longitude,
      };

      callback(null, res);
    }
  );
};
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coord, callback) {
  request(
    `http://api.open-notify.org/iss/v1/?${coord.latitude}&lon=${coord.longitude}`,
    function (error, response, body) {
      // pass through error to callback if error
      if (error) {
        callback(error, null);
      }

      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching fly over time for coordinates. Response: ${body}`
          ),
          null
        );
        return;
      }
      const passes = JSON.parse(body).response;

      callback(null, passes);
    }
  );
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coord) => {
      if (error) {
        return callback(error, null);
    }

    fetchISSFlyOverTimes(sampleCoord, (error, passTimes) => {
      if (error) {
        return callback(error, null);
    }

    callback(null, nextPasses);


});

module.exports = { nextISSTimesForMyLocation };
