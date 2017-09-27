# Angular 1.6 Project Template
This project template is for projects based on AngularJS 1. The technology is on Angular 1.6, gulp,
bower. 

[![Build Status](https://http://yeoman.io/generators/)](http://yeoman.io/generators/)

# Development Setup
From the root of the project.

Install the npm packages

    npm install

Make sure you have bower installed globally

    npm install -g bower

Install the bower packages

    bower install

Make sure you have gulp installed globally

    npm install -g gulp

Make sure everything is setup correctly

    gulp test

Build and deploy the app to a DHIS Instance

    gulp clean deploy --url=http://localhost:8080 --username=admin --password=district

To create a zip of the app application

    gulp pack

The zip file should then be available in the folder target.




