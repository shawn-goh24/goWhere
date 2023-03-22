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
    case "1":
      month = "January";
      break;
    case "2":
      month = "February";
      break;
    case "3":
      month = "March";
      break;
    case "4":
      month = "April";
      break;
    case "5":
      month = "May";
      break;
    case "6":
      month = "June";
      break;
    case "7":
      month = "July";
      break;
    case "8":
      month = "August";
      break;
    case "9":
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

/**
 * Function to convert Firebase Auth error code into error messages
 * @param {string} errorCode
 * @returns {string} error message that will be displayed to users
 */
export const setErrorMessage = (errorCode) => {
  let errorMsg = "Sorry, ";
  switch (errorCode) {
    case "auth/wrong-password":
      errorMsg += "wrong Password, please try again";
      break;
    case "auth/user-not-found":
      errorMsg += "unable to find user, please sign up a new account";
      break;
    case "auth/email-already-in-use":
      errorMsg += "email has been used, please use another email";
      break;
    case "auth/weak-password":
      errorMsg += "password too weak, please enter at least 6 characters";
      break;
    case "auth/too-many-requests":
      errorMsg += "too may tries, please try again later";
      break;
    default:
      errorMsg = "";
  }
  return errorMsg;
};

/**
 * Function to get all dates within the start and end date
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {array} and array of dates in string
 */
export const getDatesInRange = (startDate, endDate) => {
  if (!startDate) return [];

  // Split the date string to swop day and month position
  // This is required to use new Date()
  const startDateArr = startDate.split("/");
  const endDateArr = endDate.split("/");

  const start = `${startDateArr[1]}-${startDateArr[0]}-${startDateArr[2]}`;
  const end = `${endDateArr[1]}-${endDateArr[0]}-${endDateArr[2]}`;

  // Get new date from the new string
  const newStart = new Date(start);
  const newEnd = new Date(end);

  const date = new Date(newStart.getTime());
  const dates = [];

  while (date <= newEnd) {
    // To prevent OS from getting the date format differently,
    // get the day, month, year separately and reconstruct the date string
    let newDate = new Date(date);
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    let fullDate = `${day}/${month}/${year}`;
    dates.push(fullDate);
    // dates.push(new Date(date).toLocaleDateString());
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export const getItineraryItems = (places) => {
  let itineraryItems = [];
  for (const place in places) {
    if (places[place].date) {
      itineraryItems.push(places[place]);
    }
  }
  return itineraryItems;
};

export const createItinerary = (tripDetails) => {
  console.log(tripDetails);
  const tripDates = getDatesInRange(tripDetails.startDate, tripDetails.endDate);
  const itinerary = {};
  const finalItinerary = [];
  tripDates.forEach((date) => {
    if (!itinerary[date]) {
      itinerary[date] = [];
    }
    // const day = {date: []}
    // itinerary.push(day)
  });

  if (tripDetails.places) {
    for (const place in tripDetails.places) {
      if (itinerary[tripDetails.places[place].date])
        itinerary[tripDetails.places[place].date].push(
          tripDetails.places[place]
        );
    }
  }

  // console.log(itinerary);

  for (const day in itinerary) {
    // console.log(itinerary[day]);
    const newDay = { [day]: itinerary[day] };

    finalItinerary.push(newDay);
  }

  // console.log("ITINERARY START");
  // console.log(finalItinerary);
  // console.log("ITINERARY END");

  return finalItinerary;
};
