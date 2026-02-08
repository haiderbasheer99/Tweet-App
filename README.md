# Tweet REST API With JWT-Authentication Project

## Nestjs Tweet Project showing CRUD operation based on Tweets, Hashtags and Authentication based on OTP VERIFICATION. and using Cloudinary for Images.

This project showing how to create a simple Tweet REST API . Every part of this project is a sample code which show you how to do the following:

* Create a custom web server with Nestjs using HTTP requests
* Create a Tweet REST API using CRUD system
* Create a Signup and Login Routes to Authenticate a User
* Sending OTP VERIFICATION Code to make the last phase of Authentication
* Allow Authenticated Users to Create their Own Profile
* Allow Authenticated Users to Create Tweet and Hashtags and other Operations
* How to Apply Rate Limiting to your Project 
* make a Dynamic ENV file to help you
* create and run migrations for production phase
* enable hot reloading script

## How to install this Tweet Project on your computer

1. Clone this Project
2. install missing packeges using `npm install`
3. Create three ENV file one for development other for test and last one for production
4. run `npm run start:dev` to run your Project in Development Mode

## How to setup enviroment file

1. for the `PORT` variable you need to provide a port number for your app to run locally
2. for the `DB_HOST` write `localhost`
3. for the `DB_PORT` write the defalut port number `5432`
4. for the `DB_USERNAME` write `postgres`
5. for the `DB_PASSWORD` write your password on your pgAdmin server
6. for the `DB_NAME` write your database name on your pgAdmin server
7. for the `DB_SYNC` set it to `true` and false when you are in production
8. for the `AUTO_LOAD` set it to `true`
9. for the `JWT_TOKEN_SECRET` go to this link (https://jwtsecrets.com/#generator)
10. for the `JWT_TOKEN_EXPIRESIN` write time you want the token to be expired
11. for the `REFRESH_TOKEN_EXPIRESIN`  write time you want the refresh token to be expired
12. for the `JWT_TOKEN_AUDIENCE` write `localhost:3000`
13. for the `JWT_TOKEN_ISSUER` write `localhost:3000`
14. for setting Email Configuration check this link(https://youtu.be/cXdQZjGsybE?si=_vFkbfKQRNJWGVEQ)

## How to tweak this Project for your own uses 

Since this is an example Tweet project , I'd encourge you to clone and rename this project for your own purpose. It's a good starter boilerplate

## Find a bug?

If you found an issue or would like to submit an improvement  to this project , please submit an issue using the issues tab above. And if you like to submit an issue with a fix, reference the issue you created!
