# salesforce-jwt-generator #
Using the JWT OAuth Flow requires you to:
* Generate a public/private key pair
* Create a Connected App
* Generate a JWT signing it with the private key
* Exchange the JWT for an access token
* Use the access token as a Bearer token

Below there is a section for each of the above steps.

## Generate public/private key pair ##
Generate a public/private keypair using openssl and fill in the required info when you generate the certificate.
```
openssl req -newkey rsa:2048 -nodes -keyout private_key.pem -x509 -days 365 -out certificate.pem
openssl x509 -outform der -in certificate.pem -out public_key.cer
openssl x509 -in certificate.pem -pubkey > public_key.pem
```

## Create a Connected App ##
In Salesforce create a Connected App through the App Manager in Setup and upload the public key (public_key.cer from the above steps) to the app. Be sure to select the offline_access scope as well as other required scopes. For testing the `openid` scope is always good. Save the Connected App and make a note of the consumer key (client_id).

## Generate a JWT ##
Use the node.js app in this repo to create a JWT. Once you've cloned the repo create a `.env` file with the following 
keys:
* SUBJECT (the username of the user to impersonate)
* CLIENT_ID (the consumer key (client_id) of the Connected App you created)
* **optional** AUDIENCE (https://login.salesforce.com or https://test.salesforce.com as appropriate) 
* PATH_PRIVATE_KEY (path to the pem-file with the private key (`private_key.pem`from above))
* PATH_PUBLIC_KEY (path to the pem-file with the public key (`public_key.pem`from above))

**Please note:** The JWT expires in 5 minutes so be quick about exchanging it for an access token!

## Exchange the JWT for an access token ##
Using Postman or similar post to the OAuth token-endpoint of Salesforce specifying a `grant_type`-parameter of `urn:ietf:params:oauth:grant-type:jwt-bearer` and specify the JWT in the `assertion` parameter.

```
POST /services/oauth2/token HTTP/1.1
Host: login.salesforce.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 731
Connection: close

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzQzNDQzNDcsImV4cCI6MTU3NDM0NDY0NywiYXVkIjoiaHR0cHM6Ly9sb2dpbi5zYWxlc2ZvcmNlLmNvbSIsImlzcyI6Inh5ejEyMyIsInN1YiI6Impkb2VAZm9vLmRlbW8ifQ.jpEPDj_9DEhzvCUGwvEefZvd63IPvtBAZCSJ_-RJ-nlAqktbwoMoCrUFb_S1u0xRuWKBhwY7Mg58claQN2UTyxhjjDYzchIRsTbrRB-KNxzd6J_ew0of8IpB8NWN_1245KuO9clfo_Yoq8wwZUTBSSt55jh4-TyjpRg4UjIikus76GZL0xvWBWfGD2zxgshOgWMk-sewJE5REGP8FPz-SqV6L_o_ua82FbBvpchwRavFmK-y0E8kDNtoOhJyW-P8jvTMfZog1hslqPQBF6-z9EBUGFb482DrEh1vspwIGV-ioLHTmJo5kBhsJXrDG6hwODVVe2G_1eSl-52k4gOvTw
```

## Use the access token as a Bearer token ##
```
GET /id/00D3X000002KFdlUAG/0053X00000AdY37QAF HTTP/1.1
Host: login.salesforce.com
Authorization: Bearer 00D3X0000...zLwRJ3AzGgXa
Connection: close
```
