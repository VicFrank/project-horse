# project-horse

Website and Backend for Ability Arena

## Requirements

- Node.js 24.22.1 or newer (see `.nvmrc` / `.node-version`) and npm
- PostgreSQL
- Redis (optional)

`engines` is enforced (`engine-strict=true` in `.npmrc`), so installs on an older
Node fail immediately instead of breaking partway through. Build/deploy hosts must
run Node 24.22.1 or newer — older releases (e.g. Node 12) cannot read
`lockfileVersion: 3` and crash in dependency `postinstall` scripts. On a Debian/Ubuntu
host:

```sh
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
node -v   # v24.x
npm ci
```

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
