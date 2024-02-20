```
# Angular Quiz

## Project Overview
The Angular Quiz project is a web application built using Angular 7+. It showcases frontend development skills such as dynamic styling, animations, efficient data fetching, and caching. The app features a paginated list of users, detailed user views, and instant search functionality.

## Prerequisites
- Node.js (v20.10.0 or later)

## Installation and Setup

### Clone the Repository
Clone the Angular Quiz project repository from GitHub to your local machine:
```sh
git clone https://github.com/GabrielGhsoub/Angular-Quiz
```

### Project Setup
Navigate to the project directory and install the necessary dependencies:
```sh
cd angular-quiz
npm install
```

## Running the Application Locally

### Start the Application
To start the application on your local server, run the following command in the project directory:
```sh
ng serve
```
This compiles the application and makes it available at `http://localhost:4200`.

### Accessing the Application
Open your web browser and go to `http://localhost:4200`. You should now be able to use the Angular Quiz application.

## Application Features
- **Paginated Users List**: Users are displayed in a paginated format. 
- **User Details View**: Clicking on a user card reveals detailed information about the user.
- **Instant Search**: Search for users by their ID using the instant search field in the header.
- **Caching Mechanism**: Minimizes redundant network requests through caching.
- **Loading Indicator**: Displays a loading bar during pending network requests.
