// read .env
require("dotenv").config();
const fetch = require("node-fetch");
const data = (require("./jwt.js"))();

const url = process.env.AUDIENCE || 'https://login.salesforce.com';
fetch(`${url}/services/oauth2/token`, {
    "method": "post",
    "headers": {
        "content-type": "application/x-www-form-urlencoded"
    },
    "body": `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${data.token}`
}).then(resp => resp.json()).then(data => {
    if (data.error) return console.log(data);
    console.log(data);

    // compute url
    let url;
    if (data.hasOwnProperty("sfdc_community_url")) {
        // community user
        let idx = data.sfdc_community_url.lastIndexOf("/");
        let retURL = `${data.sfdc_community_url.substring(idx)}/s`;
        url = `${data.sfdc_community_url}/secur/frontdoor.jsp?sid=${data.access_token}&retURL=${retURL}`;
    } else {
        url = `${data.instance_url}/secur/frontdoor.jsp?sid=${data.access_token}`;
    }
    console.log(`Access token: ${data.access_token} `);
    console.log(url);
})