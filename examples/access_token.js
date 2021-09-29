import {config as config_env} from "dotenv";
import * as fs from "fs";
import * as jwt from "../index.js";

config_env();

const issuer = process.env.CLIENT_ID;
const subject = process.env.SUBJECT;
const audience = process.env.AUDIENCE;

// read keys
const privateKey = fs.readFileSync(process.env.PATH_PRIVATE_KEY, 'utf8');

jwt.generateJWT({
    issuer,
    audience,
    subject,
    privateKey
}).then(token => {
    console.log(`JWT\n${token}`);
    return jwt.accessTokenFromJWT({
        token,
        audience
    })
}).then(accessToken => {
    console.log(`Access token\n${accessToken}`);
})
