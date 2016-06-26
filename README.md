# Nekochan

## Set up
- Install [MongoDB](https://docs.mongodb.com/manual/installation/#tutorials)
- Make sure Node version >= 6.2
- `npm install`
- `npm i gulp -g`
- fill in `config/config.template.js` with the missing fields
- Rename `config.template.js` to `config/config.js`
- fill in `.env.template` with session secret
- Rename `.env.template` to `.env`

## Build
- `gulp build`

## Run
- Start Mongo `./scripts/db-start`, or change `--db-path` if different
- `npm start`
