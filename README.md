# project-horse

Website and Backend for Ability Arena

## Requirements

- Node.js and npm
- PostgreSQL
- Redis (optional)

## DB Setup

TODO

init.sql will initialize the postgres database

## Environment Setup

- Create `config/keys.js` and fill it with your PostgreSQL server settings as well as some empty strings for all the private keys you shouldn't have/use. Below is all the keys required to get the server running.

```js
module.exports = {
  sql: {
    dev: {
      user: "postgres",
      host: "localhost",
      database: "aadev",
      password: "totallyNotPassword",
      port: 5432,
    },
  },
  patreon: {
    oauth: {
      clientID: "",
    },
  },
  paypal: {
    dev: {
      clientID: "",
    },
  },
  stripe: {
    dev: {
      secret: "",
    },
  },
  sessionKey: "notsosecret",
};
```

- (optional) Disable redis by creating a `.env` file in the root and adding a line with the following: `no_redis=true`

## Running

- `npm install` at root
- `npm install` in /client
- `npm run dev` to launch
