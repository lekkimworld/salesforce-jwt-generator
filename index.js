const data = (require("./jwt.js"))();
console.log(`Json Web Token:\n${data.token}\n\n`);
console.log(`JWT verification result:\n ${JSON.stringify(data.legit)}`);
