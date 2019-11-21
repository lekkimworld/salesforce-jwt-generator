'use strict';
const fs = require('fs');
const jwt = require('jsonwebtoken');

// read .env
require("dotenv").config();

// must expire within 5 minutes for Salesforce
const expiresIn = 5 * 60; 	
// Salesforce only supports RS256
const algorithm = "RS256";  
// issuer = client_id / consumer key of Connected App
const issuer = process.env.CLIENT_ID;
// subject = the username of the user in Salesforce we're requesting an access token for
const subject = process.env.SUBJECT;
// audience = where is this JWT any good (https://login.salesforce.com, https://test.salesforce.com or commmunity url
const audience = process.env.AUDIENCE || 'https://login.salesforce.com';

// read keys
const privateKEY = fs.readFileSync(process.env.PATH_PRIVATE_KEY, 'utf8');
const publicKEY = fs.readFileSync(process.env.PATH_PUBLIC_KEY, 'utf8');

// additonal payload to add
const additionalPayload = {
};

// specify main payload
var signOptions = {
	issuer,
	subject,
	audience,
	expiresIn,
	algorithm
};

// sign token with private key
const token = jwt.sign(additionalPayload, privateKEY, signOptions);
console.log(`Json Web Token:\n${token}\n\n`);

// verify that it was signed correctly
 const verifyOptions = {
	issuer,
	subject,
	audience,
	expiresIn,
	algorithm
};
const legit = jwt.verify(token, publicKEY, verifyOptions);
console.log(`JWT verification result:\n ${JSON.stringify(legit)}`);
