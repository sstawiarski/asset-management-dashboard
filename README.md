## Asset Management Dashboard
  
Asset Management Dashboard is a full [MERN](https://www.mongodb.com/mern-stack) stack application for the management of assets and shipments of assets (including all CRUD operations) with a modular structure and centralized dashboard. Formerly known as Product Management Portal.
  
[![Frontend language](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org/)&nbsp;[![Backend language](https://img.shields.io/badge/Built%20with-Node.js-brightgreen)](https://reactjs.org/)&nbsp;[![Stack](https://img.shields.io/badge/Stack-MERN-yellowgreen)](https://www.mongodb.com/mern-stack)

### Motivation
This project was developed in collaboration with [Evolution Engineering & Energy Technologies](https://evolutioneng.com) as a central dashboard for the management and tracking of company assets and shipments. The goal was to build a custom application that would help to replace and amalgamate the fragmented, 3rd party management solutions currently in use. Prior to this application, the company did not have a reliable way to track and maintain history, status, rental assignment, or ownership (among other details) of these products.
### Features
- **Central dashboard** with global search
- Listing, filtering, and creation of assets and shipments
- **Map views** for asset locations and shipment routes
- Support for **file attachments** to shipments
- Error-checking and **schema validation** of assemblies
- "Shopping cart"-style tools for **creating and managing assemblies and shipments**

### Live Demo
A live demo can be found [here](https://capstone.shawnstawiarski.com).  
  
You may use the following credentials to log in:
```
Username: jsmith
Password: password1
```
**Note:** The live demo is hosted on a free [Heroku](https://www.heroku.com/) server which shuts down after 30 minutes of inactivity (and deletes files with it). 
- You may need to refresh the page multiple times to allow the server to start before login or API calls can go through
- Some attachments may show up under a shipment's details, but attempting to view them results in a spinner because Heroku deleted the files as temporary
  - **To test attachment functionality**, upload a new attachment and immediately view it

**Demo video / project overview:** [YouTube](https://youtu.be/ess9Z7cUUzs)

### Build status
[![Build Status](https://travis-ci.com/sstawiarski/asset-management-dashboard.svg?branch=main&status=passed)](https://travis-ci.com/github/sstawiarski/asset-management-dashboard)

### Technology
##### Frontend
- [ReactJS](https://reactjs.org/)
- [Material-UI](https://material-ui.com/) (component library)
- JavaScript
- [TypeScript](https://www.typescriptlang.org/)
##### Backend
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/) (MongoDB object modeling tool)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/) (data caching)
- [Swagger UI](https://swagger.io/tools/swagger-ui/) (API documentation)
  
### Screenshots
##### Login
![Login screen](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/login.webp)
##### User Profile
![User profile](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/profile.webp)
##### Dashboard (sidebar open)
![Dashboard with sidebar open](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/dashwsidebar.webp)
##### Global Search
![Dashboard page with search bar and results](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/searchpopup.webp)
##### Search Details
![Search details page with table of search results](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/searchdetails.webp)
##### All Assets (list view)
![Table with list of all assets in the system](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/allassets.webp)
##### All Assets (map view)
![A map of assets / markers based on their locations alongside a table with list of all assets in the viewport of the map](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/mapview.webp)
##### Asset Details
![Page displaying properties of a single asset in a clean way with a timeline of its associated events](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/assetdetails.webp)
##### Assembly Manager
![Assembly manager and creator tool as a table of assets and a floating "shopping cart"-style widget](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/assembly.webp)
##### All Shipments
![Table with list of all shipments in the system, organized by their status](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/allshipments.webp)
##### Shipment Details
![Page displaying properties of a single shipment in a clean way with a map of the shipment's route and a table of the items contained in the shipment](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/shipmentdetails.webp)
##### Shipment Creator (Submission Dialog)
![Shipment creator tool with a submission dialog listing the source and destination locations of the shipments and possible overrides on the location properties](https://206e126d-9f30-4cd7-90d7-80d8d2207339.s3.us-east-2.amazonaws.com/images/screenshots/team24/submitshipment.webp)

### Installation
Further details may be found in the `frontend` folder [README.md](https://github.com/sstawiarski/asset-management-dashboard/blob/main/frontend/README.md) and the `backend` folder [README.md](https://github.com/sstawiarski/asset-management-dashboard/blob/main/backend/README.md).

Node.js version >= 14 is required to run the API server due to the usage of optional chaining.

The `package.json` file in the root project directory provides a few convenience scripts atop the normal ones. The simplest way to get started is to run 
```
npm run-script launch
```
 which will install all frontend and backend dependencies, build the frontend, run the server, and serve the frontend production code at port 3000 (by default) on `localhost`. 
   
 Building without running can be accomplished by running 

 ```
 npm run-script build
 ```
  

---
To manually launch the frontend from the `frontend` directory, ensure dependencies are installed with `npm install`, then a development build can be launched using `npm start` and a production build can be built using `npm run-script build` and served using `serve -s [build directory] -l [port]`.

To manually launch the backend server from the `backend` directory, ensure dependencies are installed with `npm install`, then the server can be started with either `node server.js` for a single invocation, or `nodemon server.js` for restarting the server when files are updated.
  
Both the frontend and the backend expect `.env` files with necessary values to run. See [here](https://github.com/sstawiarski/asset-management-dashboard/blob/main/frontend/sample.env) for the example frontend `.env` and [here](https://github.com/sstawiarski/asset-management-dashboard/blob/main/backend/sample.env) for the example backend `.env`.

##### Dependencies
- If you wish to utilize data caching for the API server, ensure you have a [Redis](https://redis.io/) server setup and running, and its URL in the backend `.env` file (see [sample .env](https://github.com/sstawiarski/asset-management-dashboard/blob/main/backend/sample.env))

### Usage
- Users must manually be created in the database in order to log in, there is currently no user creation implementation
- Sample data is provided and can be loaded into the database using the provided `/load` POST endpoints of each collection
- Additional assets, assemblies, and shipments can all be created through the GUI
### Considerations
#### Authentication
- **The method by which users are currently authenticated is not suitable for production** and all instances of user identification in the frontend will need to be retooled (for example user name display and how users are tied to the assets they create)
- The team chose to forego a robust authentication system due to the company utilizing SSO / Microsoft Active Directory as their primary user authentication strategy and integration was deemed outside the scope of the project
- The current method is a **very simple check against passwords** that are stored in the database in plaintext
  - If the user is successfully authenticated, the server sends back an encrypted JSON object that the user sends back in the body of all PATCH or POST requests in order to authorize themselves
  - This encrypted object is simply stored in LocalStorage and while it is somewhat secure due to its encryption, it is not suitable for production, nor is plaintext password storage
- Additionally, **API routes are not thoroughly protected from unauthenticated users**
- When this refactor is completed, any frontend page using the custom `useLocalStorage` hook and any backend page using the `encrypt`/`decrypt` functions and/or PATCH/POST endpoints that use the value `req.body.user` will need to be updated for the new authentication scheme

#### Database
- It's likely that the usage of the database is the area of the project where the most optimization could occur
- For one, the data we are storing is pretty highly relational but we have chosen to use MongoDB (a NoSQL database)
  - This structure required us to store ObjectId references and `populate()` them at query time (similar to a SQL JOIN, which NoSQL database are not optimized for) 
  - This both complicated our queries and likely hampers performance
- It's possible this could be remedied by denormalizing the database
  - However, the nature of the data — in particular, the recursive relationship between assets and assemblies (parents in the same collection) — may make a SQL database, such as [PostgreSQL](https://www.postgresql.org), more desirable
- As a result of this additional complexity, **the major POST and PATCH endpoints of both modules generally perform many queries** in order to properly update all the circular references, children, etc.
  - These complex endpoints are wrapped in [transactions](https://mongoosejs.com/docs/transactions.html) in order to ensure atomicity and mitigate some of the problems
  - However, **the current logic is fairly complex, likely still has errors, and may not be as performant as it could be**

#### Styling and Reponsiveness
- The current styling is **not optimized for phones or other small screens**
- While some responsive components (such as Material-UI's `Grid`) and CSS properties such as `flex` where used throughout the project, many pages and elements still do not render correctly on small screens

### API Reference
##### Frontend
Frontend components are documented throughout the project using inline comments, [JSDoc](https://jsdoc.app/), and [prop-types](https://www.npmjs.com/package/prop-types).
##### Backend
The backend server API documentation is written in OpenAPI and hosted at `/api-docs` of the server URL using [SwaggerUI](https://swagger.io/tools/swagger-ui/).

### Contributors
- [Charles Dawkins](https://github.com/cwdawki1)
- [Eric Fritts](https://github.com/efritts)
- [Maija Kingston](https://github.com/makingst)
- [Shawn Stawiarski](https://github.com/sstawiarski)
- [Gabriel Udoette](https://github.com/GUDOETTE)

### License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Full license available [here](https://github.com/sstawiarski/asset-management-dashboard/blob/main/LICENSE).