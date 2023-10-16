# API

Live at heart API is built with Fastify/TRPC - where fastify acts as the web server and TRPC as the type-safe interface.

The app connects to the API for everything it needs to be doing.

#### Loaders

A loader is an import function that gets data from a data source and stores it in the MongoDB which is the engine used for this API.

## Running locally

The API can be run in a Docker Compose environment which is provided in the `docker-compose.yml`. This way you'll get the development environment setup automatically just running `docker compose up` in your terminal from within this folder.

You can decide to run it standalone and provide your own MongoDB instance running anywhere.

### .env - Environment variables

The .env is where you provide your environment variables. The `.env.example` shows you what to put there when running it locally with Docker Compose.

## Production

The app will run in any service providing Docker support. For example Railway or Fly.io.

## Contribute

This repo is free for anyone to contribute to. To contribute, file a Pull Request and it will get a proper review and after that merged in to `main`.

## Wishlist

A good place to start working on this part of the project could be to see whats on the wishlist. The wishlist is currently empty, so it's up to you to find something that needs to be done :)
