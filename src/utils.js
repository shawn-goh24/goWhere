import { onValue, push, ref, runTransaction, update } from "firebase/database";
import { database } from "./firebase";

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
 * Function to get user's trip from a list of trips
 * @param {object} tripsObj
 * @param {string} email
 * @returns {object} All trips created by current user
 */
export const findTripsMember = (tripsObj, email) => {
  let requiredTrips = {};
  const tmpEmail = email;
  const editedEmail = tmpEmail.replace(".", "*");

  for (const trip in tripsObj) {
    if (tripsObj[trip].members) {
      // console.log(
      //   tripsObj[trip].country,
      //   editedEmail,
      //   Object.keys(tripsObj[trip].members).includes(editedEmail)
      // );
      if (Object.keys(tripsObj[trip].members).includes(editedEmail)) {
        requiredTrips[trip] = tripsObj[trip];
      }
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

/**
 * Function to create itinerary array based on the start and end date of the trip
 * @param {object} tripDetails
 * @returns {array} An array of dates, each date is an object that stores an array of places for the date
 */
export const createItinerary = (tripDetails) => {
  const tripDates = getDatesInRange(tripDetails.startDate, tripDetails.endDate);
  const itinerary = {};
  const finalItinerary = [];
  tripDates.forEach((date) => {
    if (!itinerary[date]) {
      itinerary[date] = [];
    }
  });

  if (tripDetails.places) {
    for (const place in tripDetails.places) {
      if (itinerary[tripDetails.places[place].date])
        itinerary[tripDetails.places[place].date].push(
          tripDetails.places[place]
        );
    }
  }

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

/**
 * Function to convert an object into an array
 * @param {object} obj
 * @returns {array} An array created from object keys
 */
export const createArray = (obj) => {
  const arr = [];
  for (const key in obj) {
    const newKey = obj[key];

    arr.push(newKey);
  }
  return arr;
};

/**
 * Function to check if a place exist in that day's itinerary
 * @param {array} placeArr
 * @param {string} uid
 * @returns {boolean} If a place exist in that day's itinerary, return true.
 */
export const findDuplicate = (placeArr, uid) => {
  for (let i = 0; i < placeArr.length; i++) {
    if (placeArr[i].uid === uid) {
      return [true, i];
    }
  }
  return false;
};

/**
 * Function to filter out places that is tagged with the same date
 * @param {array} itineraryItems
 * @param {string} date
 * @returns {array} An array of places that is tagged with the same date
 */
export const getPlaces = (itineraryItems, date) => {
  const placeArr = [];
  itineraryItems.forEach((item) => {
    if (item.date === date) {
      placeArr.push(item);
    }
  });
  return placeArr;
};

/**
 * Function to sort array in ascending order based on the position key
 * @param {array} placeArr
 * @returns {array} sorted array
 */
export const sortPlaces = (placeArr) => {
  placeArr.sort((a, b) => {
    if (a.position > b.position) {
      return 1;
    }
    if (a.position < b.position) {
      return -1;
    }
    return 0;
  });
  return placeArr;
};

/**
 * Function to generate the next position to sort places
 * @param {array} placesArr
 * @returns {number} Next possible place id
 */
export const generateNextId = (placesArr) => {
  let nextId = 0;
  placesArr.forEach((place) => {
    if (place.position > nextId) {
      nextId = place.position + 1;
    } else if (place.position === nextId) {
      nextId++;
    }
  });
  return nextId;
};

/**
 * Function to create and object from places array
 * used to update Firebase Realtime Database
 * @param {array} arr
 * @returns {object} Places object
 */
export const createUpdateObj = (arr) => {
  const obj = {};

  arr.forEach((place, index) => {
    place.position = index;
    obj[place.uid] = place;
  });

  return obj;
};

export const resetDates = (obj) => {
  for (const place in obj) {
    obj[place].date = "";
  }
  return obj;
};
