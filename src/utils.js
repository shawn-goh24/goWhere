/**
 * Function to get user's trip from a list of trips
 * @param {object} tripsObj
 * @param {string} userId
 * @returns {object} All trips created by current user
 */
export const findTrips = (tripsObj, userId) => {
  let requiredTrips = {};

  for (const trip in tripsObj) {
    if (tripsObj[trip].creatorId === userId) {
      requiredTrips[trip] = tripsObj[trip];
    }
  }

  return requiredTrips;
};

/**
 * Function to create trips array from trips object
 * Sort the array according to start date in descending order
 * @param {object} tripsObj
 * @returns {array}
 */
export const createTripArr = (tripsObj) => {
  let tripsArr = [];

  for (const trip in tripsObj) {
    const startDateArr = tripsObj[trip]["startDate"].split("/");
    const newStartDate = `${startDateArr[1]}-${startDateArr[0]}-${startDateArr[2]}`;
    const newDate = new Date(newStartDate);
    tripsObj[trip]["newStartDate"] = newDate;
    tripsArr.push(tripsObj[trip]);
  }

  tripsArr.sort((a, b) => {
    return b.newStartDate - a.newStartDate;
  });

  return tripsArr;
};

/**
 * Function to calculate the number of countries the user visited
 * @param {object} tripsObj
 * @returns {number} number of unique countries
 */
export const calculateCountries = (tripsObj) => {
  const countries = {};

  for (const trip in tripsObj) {
    if (!countries[tripsObj[trip]["country"]]) {
      countries[tripsObj[trip]["country"]] = true;
    }
  }
  return Object.keys(countries).length;
};

/**
 * Function to calculate the length of the trips object
 * @param {object} tripsObj
 * @returns
 */
export const calculateTrips = (tripsObj) => {
  return Object.keys(tripsObj).length;
};

/**
 * Function to concatenate start and end date of the trips
 * @param {string} start Start date of the trip
 * @param {string} end End date of the trip
 * @returns {string}
 */
export const convertTripDate = (start, end) => {
  if (
    start === undefined ||
    start === null ||
    end === undefined ||
    end === null
  ) {
    return;
  }

  let tripDate = "";

  const startDateArr = start.split("/");
  const endDateArr = end.split("/");

  let [startDay, startMonth, startYear] = startDateArr;
  let [endDay, endMonth, endYear] = endDateArr;

  if (startMonth === endMonth && startYear === endYear && startDay === endDay) {
    const month = getMonth(startMonth);
    return (tripDate = `${startDay} ${month} ${startYear}`);
  } else if (startMonth === endMonth && startYear === endYear) {
    const month = getMonth(startMonth);
    return (tripDate = `${startDay} - ${endDay} ${month} ${startYear}`);
  } else if (startYear === endYear) {
    startMonth = getMonth(startMonth);
    endMonth = getMonth(endMonth);
    return (tripDate = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`);
  } else {
    startMonth = getMonth(startMonth);
    endMonth = getMonth(endMonth);
    return (tripDate = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`);
  }
};

/**
 * Helper function to get the month based on the string number
 * @param {string} stringNum
 * @returns {string}
 */
const getMonth = (stringNum) => {
  let month;
  switch (stringNum) {
    case "01":
      month = "January";
      break;
    case "02":
      month = "February";
      break;
    case "03":
      month = "March";
      break;
    case "04":
      month = "April";
      break;
    case "05":
      month = "May";
      break;
    case "06":
      month = "June";
      break;
    case "07":
      month = "July";
      break;
    case "08":
      month = "August";
      break;
    case "09":
      month = "September";
      break;
    case "10":
      month = "October";
      break;
    case "11":
      month = "November";
      break;
    default:
      month = "December";
  }
  return month;
};
