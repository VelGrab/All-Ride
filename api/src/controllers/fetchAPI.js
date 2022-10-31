require("dotenv").config();
const verifyToken = process.env.VERIFY_TOKEN;
const axios = require("axios");

const getDataApi = async () => {
  try {
    /* Making a request to the API and returning the data. */
    const response = await axios.get(
      "https://stage.allrideapp.com/ext/api/v1/recruiting/points",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${verifyToken}`,
        },
      }
    );

    /* The main coordinate of the map. */
    let mainCoordinate = {
      lat: -33.437673,
      lon: -70.650479,
    };

    /**
     * Convert degrees to radians.
     * @param deg - The degree value to be converted to radians.
     * @returns the value of the argument multiplied by the value of pi divided by 180.
     */
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    /**
     * It calculates the distance between two points on the Earth's surface, given their latitude and
     * longitude.
     * @param lat1 - latitude of the first point
     * @param lon1 - longitude of the first point
     * @param lat2 - The latitude of the second point.
     * @param lon2 - longitude of the second point
     * @returns The distance between two points on the Earth.
     */
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const radius = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = radius * c;
      return d;
    };

    /* Adding a new property to the object. */
    const data = response.data.map((elem) => {
      const distance = calculateDistance(
        mainCoordinate.lat,
        mainCoordinate.lon,
        elem.lat,
        elem.lon
      );
      return {
        ...elem,
        distance,
      };
    });

    /* Sorting the data by distance or date. */
    const sortedData =
      data.distance === data.distance
        ? data.sort((a, b) => a.distance - b.distance)
        : data.sort((a, b) => a.date.localeCompare(b.date));

    /* Grouping the data by district. */
    const dataByDistrict = sortedData.reduce((acc, elem) => {
      if (acc[elem.district]) elem.district;
      acc[elem.district] = acc[elem.district] || [];
      acc[elem.district].push({
        name: elem.name,
        date: elem.date,
        lat: elem.lat,
        lon: elem.lon,
        distance: elem.distance,
      });
      return acc;
    }, {});

    /* Calculating the average distance of each district. */
    const averageDistance = Object.keys(dataByDistrict).map((key) => {
      const average =
        dataByDistrict[key]
          .map((elem) => elem.distance)
          .reduce((a, b) => a + b) / dataByDistrict[key].length;
      return {
        district: key,
        average,
      };
    });

    return { dataByDistrict, averageDistance };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDataApi,
};
