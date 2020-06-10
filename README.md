# Smasher
  An authorative game server developed in Typescript using nestjs framework supporting realtime and turn-based multiplayer games.It uses websocket as transport layer to transfer game data between clients.

## Stack information
* Nestjs - Nodejs framework
* Postgres - Database for user management
* Socket.io - Realtime communication between clients
* Redis - To support and manage game state between clients.
* TypeOrm - Orm module for typescript.

## Features
* WebSocket-based communication.
* Matchmaking clients into game sessions.
* Provides socket events to autojoin,create and cancel game events for clients.

## Installation
1.To run postgres and redis spin the containers using,
```bash
$ docker-compose up -d
```
2.Install all neccessary package using,
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  [MIT licensed](LICENSE).
