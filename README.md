# goWhere

<img src="./src/Assets/goWhere-logo.svg"  width="70%" height="40%" alt='goWhere'>\
A travel planner website for users to plan their travels together with their families/friends.
_Project 2 for Rocket Academy Bootcamp_

### Preview

![goWhere gif](./src/Assets/gowhere-gif.gif)

## Features

- Allowing users to login/signup with [Firebase](https://firebase.google.com/)
- Add and delete places of interest
- Markers will be displayed on map for each added location
- Add places of interest to initerary
- Invite family/friends to plan the trip together
  - Trips invitation sent using [Emailjs](https://www.emailjs.com/)
  - Allowing members to add new places
  - Enabling like buttons to each places

## Tech Used

- Front end: [React](https://react.dev/)
- Routing: [React Router](https://reactrouter.com/en/main)
- UI: [Material-UI](https://mui.com/)
- Storage/Database/Auth: [Firebase](https://firebase.google.com/)
- Map: [Google Maps](https://developers.google.com/maps)
- Trip Invitation: [Emailjs](https://www.emailjs.com/docs/sdk/installation/)
- [Unsplash](https://unsplash.com/developers) used for trip cover image when created

## Setup

This project is created using create-react-app. Before starting, it is required to run the following steps for the application to work

1. Clone repo to local

2. Configure `.env` file, make sure to get your own API keys stated below and insert it into your `.env` file
   - If unsure where to get API keys, refer to the Tech Used for the documents

```
REACT_APP_MAPS_API = <Insert Google Map API key>
REACT_APP_FIREBASE_API = <Insert Firebase API key>
REACT_APP_EMAILJS_SERVICEID = <Insert emailjs service id key>
REACT_APP_EMAILJS_TEMPLATEID = <Insert emailjs template id key>
REACT_APP_EMAILJS_PUBLICKEY =  <Insert emailjs public key key>
REACT_APP_UNSPLASH_KEY = <Insert unsplash api key>
```

3. Install all dependencies required in this repo, and run locally

```
npm i
npm start
```

4. Enjoy!

## Future improvements

- Custom markers to show places belongs to which day
- Allowing refresh to planner page (Current limitations: not able to refresh)
- Adding more validations to start-end dates (prevent creating dates before selected start dates and current day)

## Contributors

- [Me, Shawn](https://github.com/shawn-goh24)
- [Huang Wei Tian](https://github.com/hWeitian)
