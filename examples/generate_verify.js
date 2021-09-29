import {config as config_env} from "dotenv";
import * as fs from "fs";
import * as jwt from "../index.js";

config_env();

const issuer = process.env.CLIENT_ID;
const subject = process.env.SUBJECT;
const audience = process.env.AUDIENCE;

// read keys
const privateKey = fs.readFileSync(process.env.PATH_PRIVATE_KEY, 'utf8');
const publicKey = fs.readFileSync(process.env.PATH_PUBLIC_KEY, 'utf8');

jwt.generateJWT({
    issuer,
    subject,
    audience,
    privateKey
}).then(token => {
    console.log(`Json Web Token:\n${token}\n\n`);
    return jwt.verifyJWT({
        token,
        subject,
        issuer,
        audience,
        publicKey
    })
}).then(legit => {
    console.log(`JWT verification result:\n ${JSON.stringify(legit)}`);
})
